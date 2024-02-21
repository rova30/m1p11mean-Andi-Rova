const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const connectionString = 'mongodb+srv://webavanceem1:final@clusterm1.kqgspnb.mongodb.net/?retryWrites=true&w=majority';

router.use(bodyParser.json());

router.get('/appointmentsByEmployeeAndDateAndStatus/:employeeId/:date/:statut', async (req, res) => {
    try {
        const { employeeId, date, statut } = req.params;

        // Convertir la date en objet Date pour rechercher sur toute la journée
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 1); // Ajouter un jour pour obtenir la fin de la journée

        const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
        const db = client.db('finalexam');

        const appointments = await db.collection('AssignmentAppointment').aggregate([
            {
                $match: {
                    'employee._id': employeeId,
                    'dateTimeEnd': {
                        $gte: startDate.toISOString(), // Début de la journée en format ISOString
                        $lt: endDate.toISOString() // Fin de la journée en format ISOString
                    }, // Rechercher sur toute la journée
                    'statut': parseInt(statut)
                }
            },
            {
                $addFields: {
                    servicesArray: [ "$services" ] // Convertir l'objet services en un tableau contenant un seul élément
                }
            },
            {
                $unwind: "$servicesArray" // Dérouler le tableau pour traiter chaque élément séparément
            },
            {
                $project: {
                    _id: 1,
                    appointment: 1,
                    employee: 1,
                    dateTimeStart: 1,
                    dateTimeEnd: 1,
                    statut: 1,
                    services: 1,
                    totalCommission: {
                        $multiply: [
                            { $divide: ["$servicesArray.commission", 100] },
                            "$servicesArray.cost"
                        ]
                    }
                }
            }
        ]).toArray();
        console.log(appointments);
        res.json(appointments);
        client.close();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching appointments by employee, date, and status' });
    }
});

module.exports = router;
