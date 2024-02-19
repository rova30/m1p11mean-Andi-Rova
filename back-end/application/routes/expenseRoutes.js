const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const connectionString = 'mongodb+srv://webavanceem1:final@clusterm1.kqgspnb.mongodb.net/?retryWrites=true&w=majority';

router.use(bodyParser.json());

router.post('/addEmployee', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is missing or invalid' });
    }
    const { firstName, lastName, address, contact, email, password, photo } = req.body;
    const newEmployee = {
      firstName,
      lastName,
      address,
      contact,
      email,
      password,
      photo
    };
    const result = await db.collection('Employee').insertOne(newEmployee);
    res.json({ message: 'Employee added successfully' });
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding employee' });
  }
});

router.get('/allEmployees', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const pageSize = parseInt(req.query.pageSize) || 10; 
    const skip = (page - 1) * pageSize;

    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');

    const employees = await db.collection('Employee')
                               .aggregate([
                                  { $skip: skip },
                                  { $limit: pageSize }
                               ])
                               .toArray();

    res.json(employees);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching employees' });
  }
});


router.get('/expensesByMonth/:year', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    const year = parseInt(req.params.year);

    const expensesByMonth = await db.collection('Expenses').aggregate([
      {
        $match: {
          $expr: { $eq: [{ $year: "$dateTime" }, year] }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$dateTime" }
          },
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          totalAmount: 1
        }
      }
    ]).toArray();
    res.json(expensesByMonth);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching expenses by year' });
  }
});


// Type
router.post('/addExpenseCategory', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is missing or invalid' });
    }
    const { category } = req.body;
    const newExpenseCategory = {
      category
    };
    const result = await db.collection('ExpensesCategory').insertOne(newExpenseCategory);
    res.json({ message: 'ExpensesCategory added successfully' });
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding expensesCategory' });
  }
});

router.get('/allExpensesCategory', async (req, res) => {
  try {
    const page = parseInt(req.query.page); 
    const pageSize = parseInt(req.query.pageSize); 
    const skip = (page - 1) * pageSize;

    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');

    const expensesCategory = await db.collection('ExpensesCategory')
                               .aggregate([
                                  { $skip: skip },
                                  { $limit: pageSize },
                                  {
                                    $project: {
                                      category: 1
                                    }
                                  }
                               ])
                               .toArray();

    res.json(expensesCategory);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching expensesCategory' });
  }
});

router.get('/totalExpensesCategoryCount', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');

    const count = await db.collection('ExpensesCategory').countDocuments();

    res.json(count);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching total employees count' });
  }
});

module.exports = router;
