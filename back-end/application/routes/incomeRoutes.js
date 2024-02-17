const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const connectionString = 'mongodb+srv://webavanceem1:final@clusterm1.kqgspnb.mongodb.net/?retryWrites=true&w=majority';

router.use(bodyParser.json());

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

router.get('/incomesByMonth', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    const incomesByMonth = await db.collection('Incomes').aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$dateTime" },
            month: { $month: "$dateTime" }
          },
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalAmount: 1
        }
      }
    ]).toArray();
    console.log(incomesByMonth);
    res.json(incomesByMonth);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching incomes by month' });
  }
});



router.get('/incomesByYearAndMonth/:year/:month', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);

    const incomesByYearAndMonth = await db.collection('Incomes').aggregate([
      {
        $match: {
          $expr: { $and: [{ $eq: [{ $year: "$dateTime" }, year] }, { $eq: [{ $month: "$dateTime" }, month] }] }
        }
      },
      {
        $group: {
          _id: { $dayOfMonth: "$dateTime" },
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          day: "$_id",
          totalAmount: 1
        }
      }
    ]).toArray();

    res.json(incomesByYearAndMonth);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching incomes by month and day' });
  }
});


module.exports = router;
