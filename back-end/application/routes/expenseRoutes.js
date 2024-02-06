const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const connectionString = 'mongodb+srv://webavanceem1:final@clusterm1.kqgspnb.mongodb.net/?retryWrites=true&w=majority';

router.use(bodyParser.json());
// tout ce qui est rattaché au dépense
router.post('/addExpenseCat', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is missing or invalid' });
    }
    const { category } = req.body;
    const newExpenseCat = {
      category
    };
    const result = await db.collection('ExpensesCategory').insertOne(newExpenseCat);
    res.json({ message: 'Customer added successfully' });
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding customer' });
  }
});


router.post('/addExpense', async (req, res) => {
    try {
      const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
      const db = client.db('finalexam');
      if (!req.body) {
        return res.status(400).json({ error: 'Request body is missing or invalid' });
      }
      const { category, amount, dateTime } = req.body;
      const newExpense = {
        category,
        amount,
        dateTime
      };
      const result = await db.collection('Expenses').insertOne(newExpense);
      res.json({ message: 'Expense added successfully' });
      client.close();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error adding expense' });
    }
  });


router.get('/categoriesExpenselist', async (req, res) => {
try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    const categories = await db.collection('ExpensesCategory').find({}).toArray();
    res.json(categories);
    client.close();
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching categories' });
}
});



module.exports = router;
