const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const connectionString = 'mongodb+srv://webavanceem1:final@clusterm1.kqgspnb.mongodb.net/?retryWrites=true&w=majority';

router.use(bodyParser.json());

function generateRandomToken(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  return token;
}

router.post('/loginManager', async (req, res) => {
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

    const manager = await db.collection('Manager').findOne(loginData);
    if(manager != null) {
      var filterToken = {
        manager : manager._id,
        expiryDate: { $gte: new Date() },
      };
      const token = await db.collection('TokenManager').findOne(filterToken);

      if(token != null) {
        res.status(200).json({ message: "Connexion réussie",manager: manager, token: token });
      } else{
        const newTokenValue = generateRandomToken(40);
        const newToken = {
            manager: manager._id,
            token: newTokenValue,
            expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }

        console.log(newToken)

        const nToken = await db.collection('TokenManager').insertOne(newToken);
        const insertedToken = await db.collection('TokenManager').findOne({ _id: nToken.insertedId });
        res.status(200).json({ message: "Connexion réussie",manager: manager, token: insertedToken });
      }
    }else{
      res.status(401).json({ message: "Manager non-identifié"});
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

    console.log(tokenData)

    const tokenManager = await db.collection('TokenManager').findOne(tokenData);
    if(tokenManager == null) {
      res.status(403).json({ message: "Veuillez vous connecter" });
    }else{
      const manager = await db.collection('Manager').findOne(tokenManager.manager);
      res.status(200).json({ message: "Manager récupéré", manager: manager});
    }
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error getting manager' });
  }
});


module.exports = router;
