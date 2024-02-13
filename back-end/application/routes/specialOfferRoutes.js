const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const connectionString = 'mongodb+srv://webavanceem1:final@clusterm1.kqgspnb.mongodb.net/?retryWrites=true&w=majority';

router.use(bodyParser.json());

router.post('/addSpecialOffer', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is missing or invalid' });
    }
    const { name, description, reduction, price, dateStart, dateEnd, services } = req.body;
    const newSpecialOffer = {
      name,
      description,
      reduction,
      price,
      dateStart,
      dateEnd,
      services
    };
    const result = await db.collection('SpecialOffer').insertOne(newSpecialOffer);
    res.json({ message: 'SpecialOffer added successfully' });
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding SpecialOffer' });
  }
});

router.get('/allSpecialOffers', async (req, res) => {
  try {
    const page = parseInt(req.query.page); 
    const pageSize = parseInt(req.query.pageSize); 
    const skip = (page - 1) * pageSize;

    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');

    const specialOffers = await db.collection('SpecialOffer')
                               .aggregate([
                                  { $skip: skip },
                                  { $limit: pageSize },
                                  { 
                                    $lookup: {
                                      from: 'Service',
                                      localField: 'services',
                                      foreignField: '_id',
                                      as: 'services'
                                    }
                                  },
                                  {
                                    $project: {
                                      name: 1,
                                      description: 1,
                                      reduction: 1,
                                      price: 1,
                                      dateStart: 1,
                                      dateEnd: 1,
                                      'services.name': 1 
                                    }
                                  },
                                  { $sort: { dateEnd: -1 } } 
                               ])
                               .toArray();
    res.json(specialOffers);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching specialOffers' });
  }
});

router.get('/totalSpecialOffersCount', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');

    const count = await db.collection('SpecialOffer').countDocuments();

    res.json(count);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching total SpecialOffers count' });
  }
});

module.exports = router;
