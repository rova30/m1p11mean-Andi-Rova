const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const connectionString = 'mongodb+srv://webavanceem1:final@clusterm1.kqgspnb.mongodb.net/?retryWrites=true&w=majority';

router.use(bodyParser.json());

router.get('/appointmentsByEmployeeAndDateAndStatus/:employeeId/:date/:statut', async (req, res) => {
    try {
        const { employeeId, date, statut } = req.params;


        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1); 

        const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
        const db = client.db('finalexam');

        const appointments = await db.collection('AssignmentAppointment').aggregate([
            {
                $unwind: '$assignments' 
            },
            {
                $match: {
                    'assignments.0._id': employeeId, 
                    'assignments.3': { $gte: startDate.toISOString(), $lt: endDate.toISOString() },
                    'assignments.4': parseInt(statut) 
                }
            },
            {
                $project: {
                    _id: 1,
                    appointment: 1,
                    employee: { $arrayElemAt: ['$assignments', 0] },
                    services: { $arrayElemAt: ['$assignments', 1] },
                    dateTimeStart: { $arrayElemAt: ['$assignments', 2] },
                    dateTimeEnd: { $arrayElemAt: ['$assignments', 3] },
                    statut: { $arrayElemAt: ['$assignments', 4] },
                    commission: { $arrayElemAt: ['$assignments.commission', 0] },
                    cost: { $arrayElemAt: ['$assignments.cost', 0] },
                    totalCommission: {
                        $multiply: [
                            { $divide: [{ $toDouble: { $arrayElemAt: ['$assignments.commission', 0] } }, 100] }, 
                            { $toDouble: { $arrayElemAt: ['$assignments.cost', 0] } } 
                        ]
                    }
                }
            }
                     
        ]).toArray();
        

        res.json(appointments);
        client.close();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching appointments by employee, date, and status' });
    }
});



router.get('/appointmentsAssignedByEmployee/:employeeId/:statut', async (req, res) => {
    try {
        const { employeeId, statut } = req.params;

        const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
        const db = client.db('finalexam');

        const appointments = await db.collection('AssignmentAppointment').find({
            'assignments.0._id': employeeId 
        }).toArray();

        const filteredAppointmentss = appointments.filter(appointment => {
            const firstAssignment = appointment.assignments[0];
            return firstAssignment && firstAssignment[4] ===  parseInt(statut) ;
        });
        
        const filteredAppointments = await Promise.all(filteredAppointmentss.map(async appointment => {
            const payment = await db.collection('Payment').find({ 'appointment._id': appointment.appointment._id }).sort({ 'dateTime': -1 }).limit(1).toArray();
            const leftToPay = payment.length > 0 ? payment[0].leftToPay : 0; 
            // console.log(appointment.appointment._id);
            // console.log(payment);
            return { ...appointment, leftToPay };
        }));
        
        const appointmentsWithPayment = filteredAppointments.map(appointment => {
            const mergedAppointment = {
                ...appointment,
                payment: appointment.leftToPay ? { leftToPay: appointment.leftToPay } : null
            };
            delete mergedAppointment.leftToPay; 
            return mergedAppointment;
        });
        
        console.log(appointmentsWithPayment);
        

        res.json(appointmentsWithPayment);
        client.close();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des rendez-vous par employé, date et statut' });
    }
});


router.put('/updateAssignmentDateTimeEnd/:appointmentId/:assignmentId', async (req, res) => {
    try {
        const { appointmentId, assignmentId } = req.params;
        const { newDateTime } = req.body;

        console.log(req.params);
        console.log(req.body);
        const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
        const db = client.db('finalexam');

        const appointment = await db.collection('AssignmentAppointment').findOne({ 'appointment._id': appointmentId });
        if (!appointment) {
            return res.status(404).json({ message: 'Rendez-vous non trouvé' });
        }

        const assignmentToUpdate = appointment.assignments.find(assignment => assignment[0]._id.toString() === assignmentId);
        if (!assignmentToUpdate) {
            return res.status(404).json({ message: 'Assignation non trouvée' });
        }

        assignmentToUpdate[6] = newDateTime;
        await db.collection('AssignmentAppointment').updateOne({ 'appointment._id': appointmentId }, { $set: { assignments: appointment.assignments } });

        client.close();

        return res.status(200).json({ message: 'Date de l\'assignation mise à jour avec succès' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erreur lors de la mise à jour de la date de l\'assignation' });
    }
});

router.put('/updateAssignmentStatus/:appointmentId/:assignmentId', async (req, res) => {
    try {
        const { appointmentId, assignmentId } = req.params;
        const { status } = req.body; 

        const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
        const db = client.db('finalexam');

        const appointment = await db.collection('AssignmentAppointment').findOne({ 'appointment._id': appointmentId });
        if (!appointment) {
            client.close();
            return res.status(404).json({ message: 'Rendez-vous non trouvé' });
        }

        const assignmentToUpdate = appointment.assignments.find(assignment => assignment[0]._id.toString() === assignmentId);
        if (!assignmentToUpdate) {
            client.close();
            return res.status(404).json({ message: 'Assignation non trouvée' });
        }
        assignmentToUpdate[4] = status;
        await db.collection('AssignmentAppointment').updateOne(
            { 'appointment._id': appointmentId },
            { $set: { assignments: appointment.assignments } }
        );
        client.close();
        return res.status(200).json({ message: 'Statut de l\'assignation mis à jour avec succès' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erreur lors de la mise à jour du statut de l\'assignation' });
    }
});


// router.get('/assignmentsByEmployee', async (req, res) => {
//     try {
//         const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
//         const db = client.db('finalexam');
//         // Récupérer tous les employees
//         const employees = await db.collection('Employee').find().toArray();

//         // Créer un objet pour stocker les assignments de chaque employé
//         const employeeAssignments = {};

//         // Parcourir chaque Employee
//         for (const employee of employees) {
//             const employeeId = employee._id.toString();
//             const assignmentsForEmployee = [];

//             // Récupérer les assignments pour cet employee de la collection AssignmentAppointment
//             const assignments = await db.collection('AssignmentAppointment').find().toArray();
//             assignments.forEach(assignment => {
//                 // Parcourir chaque élément de la liste assignments
//                 assignment.assignments.forEach(assignmentItem => {
//                     // Vérifier si l'ID de l'employé correspond à l'ID actuel
//                     if (assignmentItem[0]._id.toString() === employeeId) {
//                         assignmentsForEmployee.push(assignmentItem);
//                     }
//                 });
//             });

//             // Ajouter les assignments de l'employé au résultat
//             employeeAssignments[employeeId] = assignmentsForEmployee;
//         }

//         res.json(employeeAssignments);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Erreur lors de la récupération des assignments par employee' });
//     }
// });



// router.get('/assignmentsByEmployeeWithTotalDeadline', async (req, res) => {
//     try {
//         const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
//         const db = client.db('finalexam');

//         const employees = await db.collection('Employee').find().toArray();

//         const employeeAssignmentsWithTotalDeadline = {};

//         for (const employee of employees) {
//             const employeeId = employee._id.toString();
//             const assignmentsForEmployee = [];

//             const assignments = await db.collection('AssignmentAppointment').find().toArray();
//             assignments.forEach(assignment => {
//                 assignment.assignments.forEach(assignmentItem => {
//                     if (assignmentItem[0]._id.toString() === employeeId && assignmentItem[4] === 2) {
//                         assignmentsForEmployee.push(assignmentItem);
//                     }
//                 });
//             });

//             const totalDeadlinePerDay = {};
//             assignmentsForEmployee.forEach(assignment => {
//                 const date = new Date(assignment[2]).toISOString().split('T')[0]; 
//                 const deadline = assignment[1].deadline; 
//                 totalDeadlinePerDay[date] = (totalDeadlinePerDay[date] || 0) + deadline; 
//             });


//             employeeAssignmentsWithTotalDeadline[employeeId] = totalDeadlinePerDay;
//         }

//         res.json(employeeAssignmentsWithTotalDeadline);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Erreur lors de la récupération des assignments par employee avec la somme des deadlines par jour' });
//     }
// });



router.get('/assignmentsByEmployeeWithTotalDeadline1', async (req, res) => {
    try {
        const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
        const db = client.db('finalexam');

        // Récupérer tous les employees
        const employees = await db.collection('Employee').find().toArray();

        // Créer un objet pour stocker les assignments de chaque employé avec la somme des deadlines par jour
        const employeeAssignmentsWithTotalDeadline = {};

        // Parcourir chaque Employee
        for (const employee of employees) {
            const employeeId = employee._id.toString();
            const assignmentsForEmployee = [];

            // Récupérer les assignments pour cet employee de la collection AssignmentAppointment
            const assignments = await db.collection('AssignmentAppointment').find().toArray();
            assignments.forEach(assignment => {
                // Parcourir chaque élément de la liste assignments
                assignment.assignments.forEach(assignmentItem => {
                    // Vérifier si l'ID de l'employé correspond à l'ID actuel et que le statut est égal à 2
                    if (assignmentItem[0]._id.toString() === employeeId && assignmentItem[4] === 2) {
                        assignmentsForEmployee.push(assignmentItem);
                    }
                });
            });

            // Calculer la somme des deadlines par jour
            const totalDeadlinePerDay = {};
            assignmentsForEmployee.forEach(assignment => {
                const date = new Date(assignment[2]).toISOString().split('T')[0]; // Récupérer la date (jour)
                const deadline = assignment[1].deadline; // Récupérer la deadline
                totalDeadlinePerDay[date] = (totalDeadlinePerDay[date] || 0) + deadline; // Ajouter la deadline à la somme pour ce jour
            });

            // Calculer la moyenne pour les 3 derniers jours
            const last3Days = new Array(3).fill(0).map((_, index) => {
                const date = new Date();
                date.setDate(date.getDate() - index);
                return date.toISOString().split('T')[0];
            });

            console.log(last3Days);
            let totalSum = 0;
            let totalDays = 0;
            last3Days.forEach(day => {
                const totalDeadline = totalDeadlinePerDay[day] || 0;
                totalSum += totalDeadline;
                totalDays++;
            });

            const averageDeadline = totalDays === 0 ? 0 : totalSum / totalDays;

            // Ajouter la moyenne pour les 3 derniers jours au résultat
            employeeAssignmentsWithTotalDeadline[employeeId] = averageDeadline;
        }

        res.json(employeeAssignmentsWithTotalDeadline);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération des assignments par employee avec la somme des deadlines par jour' });
    }
});

module.exports = router;
