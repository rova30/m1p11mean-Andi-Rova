const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const connectionString = 'mongodb+srv://webavanceem1:final@clusterm1.kqgspnb.mongodb.net/?retryWrites=true&w=majority';

router.use(bodyParser.json());

router.get('/appointmentsByEmployeeAndDateAndStatus/:employeeId/:dateTimeEnd/:status', async (req, res) => {
    try {
      const { employeeId, dateTimeEnd, status } = req.params;
  
      const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
      const db = client.db('finalexam');
  
      const appointments = await db.collection('AssignmentAppointment').aggregate([
        {
          $match: {
            'employee._id': employeeId,
            'dateTimeEnd': new Date(dateTimeEnd),
            'statut': parseInt(status)
          }
        },
        {
          $lookup: {
            from: 'services',
            localField: 'services._id',
            foreignField: '_id',
            as: 'serviceDetails'
          }
        },
        {
          $project: {
            'appointment': 1,
            'employee': 1,
            'services': 1,
            'dateTimeEnd': 1,
            'statut': 1,
            'totalCommission': {
              $sum: {
                $map: {
                  input: '$services',
                  as: 'service',
                  in: {
                    $multiply: [
                      '$$service.commission',
                      '$$serviceDetails.cost'
                    ]
                  }
                }
              }
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
  
module.exports = router;
