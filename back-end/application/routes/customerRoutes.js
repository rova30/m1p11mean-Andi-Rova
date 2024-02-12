const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const connectionString = 'mongodb+srv://webavanceem1:final@clusterm1.kqgspnb.mongodb.net/?retryWrites=true&w=majority';
const generateRandomToken = require('../utils/function');

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


router.post('/loginCustomer', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is missing or invalid' });
    }

    const { email, password } = req.body;
    const loginData = {
      email: email,
      password: password,
    };

    const customer = await db.collection('Customers').findOne(loginData);
    if(customer != null) {
      var filterToken = {
        customer : customer._id,
        expiryDate: { $gte: new Date() },
      };
      const token = await db.collection('TokenCustomer').findOne(filterToken);

      if(token != null) {
        res.status(200).json({ message: "Connexion réussie",customer: customer, token: token });
      } else{
        const newTokenValue = generateRandomToken(40);
        const newToken = {
          customer: customer._id,
          token: newTokenValue,
          expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }

        const nToken = await db.collection('TokenCustomer').insertOne(newToken);
        const insertedToken = await db.collection('TokenCustomer').findOne({ _id: nToken.insertedId });
        res.status(200).json({ message: "Connexion réussie",customer: customer, token: insertedToken });
      }
    }else{
      res.status(401).json({ message: "Client non-identifié"});
    }
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error login' });
  }
});

router.get('/token', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is missing or invalid' });
    }

    const tokenData = {
      token: req.query.token,
      expiryDate: { $gte: new Date() }
    };


    const tokenCustomer = await db.collection('TokenCustomer').findOne(tokenData);
    if(tokenCustomer == null) {
      res.status(403).json({ message: "Veuillez vous connecter" });
    }else{
      console.log(tokenCustomer)
      const customer = await db.collection('Customers').findOne(tokenCustomer.customer);
      res.status(200).json({ message: "Client récupéré", customer: customer});
    }
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error getting customer' });
  }
});


router.get('/allCustomers', async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const pageSize = parseInt(req.query.pageSize);
    const skip = (page - 1) * pageSize;

    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');

    const customers = await db.collection('Customers')
                               .find()
                               .skip(skip)
                               .limit(pageSize)
                               .toArray();
    console.log(pageSize)
    res.json(customers);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching customers' });
  }
});

router.get('/totalCustomersCount', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    const count = await db.collection('Customers').countDocuments();
    res.json(count);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching total customers count' });
  }
});



module.exports = router;
