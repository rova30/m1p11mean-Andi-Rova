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
        
        console.log(req.params);
        console.log(appointments);
        res.json(appointments);
        client.close();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching appointments by employee, date, and status' });
    }
});

module.exports = router;
