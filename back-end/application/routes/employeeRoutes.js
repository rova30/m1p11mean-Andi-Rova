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
    const { firstName, lastName, address, contact, email, password, speciality, photo } = req.body;
    const newEmployee = {
      firstName,
      lastName,
      address,
      contact,
      email,
      password,
      speciality,
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
                               .find({})
                               .skip(skip)
                               .limit(pageSize)
                               .toArray();

    res.json(employees);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching employees' });
  }
});



router.put('/updateEmployee/:id', async (req, res) => {
    try {
      const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
      const db = client.db('finalexam');
  
      const employeeId = req.params.id;
      const { firstName, lastName, address, contact, email, password, speciality, photo } = req.body;
  
      const filter = { _id: ObjectId(employeeId) };
      const update = { $set: { firstName, lastName, address, contact, email, password, speciality, photo } };
  
      const result = await db.collection('Employee').updateOne(filter, update);
  
      if (result.modifiedCount === 1) {
        res.json({ message: 'Employee updated successfully' });
      } else {
        res.status(404).json({ error: 'Employee not found or no changes made' });
      }
  
      client.close();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating employee' });
    }
  });

module.exports = router;
