const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const generateRandomToken = require('../utils/function');
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
    const page = parseInt(req.query.page); 
    const pageSize = parseInt(req.query.pageSize); 
    const skip = (page - 1) * pageSize;

    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');

    const employees = await db.collection('Employee')
                               .aggregate([
                                  { $skip: skip },
                                  { $limit: pageSize },
                                  { 
                                    $lookup: {
                                      from: 'Service',
                                      localField: 'speciality',
                                      foreignField: '_id',
                                      as: 'specialities'
                                    }
                                  },
                                  {
                                    $project: {
                                      firstName: 1,
                                      lastName: 1,
                                      address: 1,
                                      contact: 1,
                                      email: 1,
                                      photo: 1,
                                      'specialities.name': 1 
                                    }
                                  }
                               ])
                               .toArray();

    res.json(employees);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching employees' });
  }
});

router.get('/totalEmployeesCount', async (req, res) => {
  try {
    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');

    const count = await db.collection('Employee').countDocuments();

    res.json(count);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching total employees count' });
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


  router.post('/loginEmployee', async (req, res) => {
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

      const employee = await db.collection('Employee').findOne(loginData);
      if(employee != null) {
        var filterToken = {
          employee : employee._id,
          expiryDate: { $gte: new Date() },
        };
        const token = await db.collection('TokenEmployee').findOne(filterToken);

        if(token != null) {
          res.status(200).json({ message: "Connexion réussie",employee: employee, token: token });
        } else{
          const newTokenValue = generateRandomToken(40);
          const newToken = {
            employee: employee._id,
            token: newTokenValue,
            expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
          }

          const nToken = await db.collection('TokenEmployee').insertOne(newToken);
          res.status(200).json({ message: "Connexion réussie",employee: employee, token: nToken });
        }
      }else{
        res.status(401).json({ message: "Employé non-identifié"});
      }
      client.close();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error login' });
    }
  });

module.exports = router;
