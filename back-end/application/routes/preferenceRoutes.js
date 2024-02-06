const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const connectionString = 'mongodb+srv://webavanceem1:final@clusterm1.kqgspnb.mongodb.net/?retryWrites=true&w=majority';

router.use(bodyParser.json());

router.post('/addPreference', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is missing or invalid' });
    }
    const { customer, employeService } = req.body;
    const newPreference = {
      customer,
      employeService
    };
    const result = await db.collection('Preference').insertOne(newPreference);
    res.json({ message: 'Preference added successfully' });
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding Preference' });
  }
});

router.get('/allPreferences', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    const preferences = await db.collection('Preference').find({}).toArray();
    res.json(preferences);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching preferences' });
  }
});

module.exports = router;
