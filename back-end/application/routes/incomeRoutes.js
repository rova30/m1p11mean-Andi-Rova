const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const connectionString = 'mongodb+srv://webavanceem1:final@clusterm1.kqgspnb.mongodb.net/?retryWrites=true&w=majority';

router.use(bodyParser.json());
// tout ce qui est rattaché au dépense
router.post('/addIncomeCat', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is missing or invalid' });
    }
    const { category } = req.body;
    const newIncomeCat = {
      category
    };
    const result = await db.collection('IncomeCategory').insertOne(newIncomeCat);
    res.json({ message: 'Customer added successfully' });
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding customer' });
  }
});


router.post('/addIncome', async (req, res) => {
    try {
      const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
      const db = client.db('finalexam');
      if (!req.body) {
        return res.status(400).json({ error: 'Request body is missing or invalid' });
      }
      const { category, amount, dateTime } = req.body;
      const newIncome = {
        category,
        amount,
        dateTime
      };
      const result = await db.collection('Incomes').insertOne(newIncome);
      res.json({ message: 'Income added successfully' });
      client.close();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error adding Income' });
    }
  });


router.get('/categoriesIncomelist', async (req, res) => {
try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    const categories = await db.collection('IncomeCategory').find({}).toArray();
    res.json(categories);
    client.close();
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching categories' });
}
});



module.exports = router;
