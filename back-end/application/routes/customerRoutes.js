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


router.get('/allCustomers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const pageSize = parseInt(req.query.pageSize) || 10; 
    const skip = (page - 1) * pageSize;

    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');

    const customers = await db.collection('Customers')
                               .aggregate([
                                  { $skip: skip },
                                  { $limit: pageSize },
                                  {
                                    $project: {
                                      firstName: 1,
                                      lastName: 1,
                                      contact: 1,
                                      email: 1,
                                      password: 1
                                    }
                                  }
                               ])
                               .toArray();

    res.json(customers);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching customers' });
  }
});

module.exports = router;
