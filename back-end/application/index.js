const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;
const connectionString = 'mongodb+srv://webavanceem1:final@clusterm1.kqgspnb.mongodb.net/?retryWrites=true&w=majority'; // Remplacez par votre chaîne de connexion MongoDB

app.use(bodyParser.json());

app.post('/addCustomer', async (req, res) => {
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

    // Insérer le nouvel objet client dans la collection Customers
    const result = await db.collection('Customers').insertOne(newCustomer);

    // Renvoyer une réponse avec le document inséré
    res.json({ message: 'Customer added successfully' });

    // Fermer la connexion à la base de données
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding customer' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
