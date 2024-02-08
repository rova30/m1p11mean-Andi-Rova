const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const connectionString = 'mongodb+srv://webavanceem1:final@clusterm1.kqgspnb.mongodb.net/?retryWrites=true&w=majority';

router.use(bodyParser.json());
// tout ce qui est rattaché au customer
router.post('/signin', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is missing or invalid' });
    }
    const { firstName, lastName, contact, email, password, virtualWallet } = req.body;
    const newCustomer = {
      firstName,
      lastName,
      contact,
      email,
      password,
      virtualWallet
    };
    const result = await db.collection('Customers').insertOne(newCustomer);
    res.json({ message: 'Inscription réussie' });
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding customer' });
  }
});

module.exports = router;
