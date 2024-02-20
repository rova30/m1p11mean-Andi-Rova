const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const connectionString = 'mongodb+srv://webavanceem1:final@clusterm1.kqgspnb.mongodb.net/?retryWrites=true&w=majority';

router.use(bodyParser.json());

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


// Pour les revenus par mois
router.get('/incomesByMonth/:year', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    const year = parseInt(req.params.year);

    const incomesByMonth = await db.collection('Incomes').aggregate([
      {
        $match: {
          $expr: { $eq: [{ $year: { $toDate: "$dateTime" } }, year] }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: { $toDate: "$dateTime" } }
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
    res.json(incomesByMonth);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching incomes by year' });
  }
});

// Pour les revenus par année et par mois
router.get('/incomesByYearAndMonth/:year/:month', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);

    const incomesByYearAndMonth = await db.collection('Incomes').aggregate([
      {
        $match: {
          $expr: { 
            $and: [
              { $eq: [{ $year: { $toDate: "$dateTime" } }, year] }, 
              { $eq: [{ $month: { $toDate: "$dateTime" } }, month] }
            ] 
          }
        }
      },
      {
        $group: {
          _id: { $dayOfMonth: { $toDate: "$dateTime" } },
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
    console.log(incomesByYearAndMonth);
    res.json(incomesByYearAndMonth);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching incomes by month and day' });
  }
});


// Pour obtenir les détails des revenus par année et mois
router.get('/incomesDetailsByYearAndMonth/:year/:month', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);

    const incomesDetails = await db.collection('Incomes').aggregate([
      {
        $match: {
          $expr: { 
            $and: [
              { $eq: [{ $year: { $toDate: "$dateTime" } }, year] }, 
              { $eq: [{ $month: { $toDate: "$dateTime" } }, month] }
            ] 
          }
        }
      },
      {
        $project: {
          _id: 1,
          category: 1,
          amount: 1,
          dateTime: 1
        }
      }
    ]).toArray();
    console.log(incomesDetails);
    res.json(incomesDetails);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching incomes details by month and year' });
  }
});


// Type
router.post('/addIncomeCategory', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is missing or invalid' });
    }
    const { type } = req.body;
    const newIncomeCategory = {
      type
    };
    const result = await db.collection('IncomeCategory').insertOne(newIncomeCategory);
    res.json({ message: 'IncomeCategory added successfully' });
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding IncomesCategory' });
  }
});

router.get('/allIncomesCategory', async (req, res) => {
  try {
    const page = parseInt(req.query.page); 
    const pageSize = parseInt(req.query.pageSize); 
    const skip = (page - 1) * pageSize;

    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');

    const incomesCategory = await db.collection('IncomeCategory')
                               .aggregate([
                                  { $skip: skip },
                                  { $limit: pageSize },
                                  {
                                    $project: {
                                      type: 1
                                    }
                                  }
                               ])
                               .toArray();

    res.json(incomesCategory);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching IncomesCategory' });
  }
});

router.get('/totalIncomesCategoryCount', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');

    const count = await db.collection('IncomeCategory').countDocuments();

    res.json(count);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching total employees count' });
  }
});


module.exports = router;
