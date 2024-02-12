const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const connectionString = 'mongodb+srv://webavanceem1:final@clusterm1.kqgspnb.mongodb.net/?retryWrites=true&w=majority';

router.use(bodyParser.json());
// tout ce qui est rattaché au customer


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
    if(customer != null) {
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

        const nToken = await db.collection('TokenManager').insertOne(newToken);
        res.status(200).json({ message: "Connexion réussie",manager: manager, token: nToken });
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

module.exports = router;
