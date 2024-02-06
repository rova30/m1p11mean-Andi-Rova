const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const connectionString = 'mongodb+srv://webavanceem1:final@clusterm1.kqgspnb.mongodb.net/?retryWrites=true&w=majority';

router.use(bodyParser.json());

router.post('/addService', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is missing or invalid' });
    }
    const { name, deadline, cost, commission } = req.body;
    const newService = {
      name,
      deadline,
      cost,
      commission
    };
    const result = await db.collection('Service').insertOne(newService);
    res.json({ message: 'Service added successfully' });
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding service' });
  }
});

router.get('/allServices', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    const services = await db.collection('Service').find({}).toArray();
    res.json(services);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching services' });
  }
});

module.exports = router;
