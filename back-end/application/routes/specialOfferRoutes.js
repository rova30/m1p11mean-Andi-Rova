const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const connectionString = 'mongodb+srv://webavanceem1:final@clusterm1.kqgspnb.mongodb.net/?retryWrites=true&w=majority';

router.use(bodyParser.json());

router.post('/addSpecialOffer', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is missing or invalid' });
    }
    const { name, description, reduction, price, dateStart, dateEnd, services } = req.body;
    const newSpecialOffer = {
      name,
      description,
      reduction,
      price,
      dateStart,
      dateEnd,
      services
    };
    const result = await db.collection('SpecialOffer').insertOne(newSpecialOffer);
    res.json({ message: 'SpecialOffer added successfully' });
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding SpecialOffer' });
  }
});

router.get('/allSpecialOffers', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    const specialOffers = await db.collection('SpecialOffer').find({}).toArray();
    res.json(specialOffers);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching specialOffers' });
  }
});

module.exports = router;
