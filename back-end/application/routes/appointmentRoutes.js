const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const connectionString = 'mongodb+srv://webavanceem1:final@clusterm1.kqgspnb.mongodb.net/?retryWrites=true&w=majority';

router.use(bodyParser.json());
const getAllEmployeeUnavailability = require('../utils/function');

const trouverIntersections = require('../utils/function');
const generateAvailableSlots = require('../utils/function');



router.get('/appointmentsByMonth/:year', async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    const appointmentsByMonth = await db.collection('Appointment').aggregate([
      {
        $match: {
          $expr: { $eq: [{ $year: { $toDate: "$dateTime" } }, year] }
        }
      },
      {
        $group: {
          _id: { $month: { $toDate: "$dateTime" } },
          totalAppointments: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id",
          totalAppointments: 1
        }
      }
    ]).toArray();
    res.json(appointmentsByMonth);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching appointments by month' });
  }
});

router.get('/appointmentsByYearAndMonth/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    const appointmentsByYearAndMonth = await db.collection('Appointment').aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $year: { $toDate: "$dateTime" } }, parseInt(year)] },
              { $eq: [{ $month: { $toDate: "$dateTime" } }, parseInt(month)] }
            ]
          }
        }
      },
      {
        $group: {
          _id: { $dayOfMonth: { $toDate: "$dateTime" } },
          totalAppointments: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          day: "$_id",
          totalAppointments: 1
        }
      }
    ]).toArray();
    res.json(appointmentsByYearAndMonth);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching appointments by year and month' });
  }
});


router.get('/getAvalaibleDate/:deadline', async (req, res) => {
  const servicesDuration = req.params.deadline;

  console.log("fefefef"+servicesDuration)
  const result = getAllEmployeeUnavailability()
  const results = trouverIntersections(result);

  const workingHours = { start: '07:00', end: '18:00' };
  
  
  const availableSlots = generateAvailableSlots(workingHours, results, 7, parseInt(servicesDuration));
  res.json(availableSlots);
});





module.exports = router;