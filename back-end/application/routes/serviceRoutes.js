const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');

const connectionString = 'mongodb+srv://webavanceem1:final@clusterm1.kqgspnb.mongodb.net/?retryWrites=true&w=majorityy&appName=ClusterM1';

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
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const skip = (page - 1) * pageSize;

    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');

    const services = await db.collection('Service')
                               .find()
                               .skip(skip)
                               .limit(pageSize)
                               .toArray();

    res.json(services);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching services' });
  }
});

router.get('/totalServicesCount', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    const count = await db.collection('Service').countDocuments();
    res.json(count);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching total Services count' });
  }
});


router.get('/service/:id', async (req, res) => {
  try {
      const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
      const db = client.db('finalexam');
      const serviceId = req.params.id;
      const objectId = new ObjectId(serviceId);
      const service = await db.collection('Service').findOne({ _id: objectId });
      res.json(service);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération du service' });
  }
});


router.put('/service/:id', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    const serviceId = req.params.id;
    const objectId = new ObjectId(serviceId);
    const updatedService = req.body;
    
    await db.collection('Service').updateOne({ _id: objectId }, { $set: updatedService });
    
    // Renvoyer une réponse JSON avec un message de succès et les données du service mises à jour
    res.status(200).json({ message: 'Service updated successfully', updatedService: updatedService });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du service' });
  }
});



module.exports = router;
