const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');

const connectionString = 'mongodb+srv://webavanceem1:final@clusterm1.kqgspnb.mongodb.net/?retryWrites=true&w=majority';

router.use(bodyParser.json());


function generateRandomToken(length) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  return token;
}

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
          console.log(newTokenValue)
          const newToken = {
            employee: employee._id,
            token: newTokenValue,
            expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
          }

          const nToken = await db.collection('TokenEmployee').insertOne(newToken);
          const insertedToken = await db.collection('TokenEmployee').findOne({ _id: nToken.insertedId });
          res.status(200).json({ message: "Connexion réussie",employee: employee, token: insertedToken });
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


  router.get('/token', async (req, res) => {
    try {
      const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
      const db = client.db('finalexam');
      if (!req.body) {
        return res.status(400).json({ error: 'Request body is missing or invalid' });
      }

      const tokenData = {
        token: req.query.token,
        expiryDate: { $gte: new Date() }
      };

      console.log(tokenData)

      const tokenEmployee = await db.collection('TokenEmployee').findOne(tokenData);
      if(tokenEmployee == null) {
        res.status(403).json({ message: "Veuillez vous connecter" });
      }else{
        const employee = await db.collection('Employee').findOne(tokenEmployee.employee);
        res.status(200).json({ message: "Employé récupéré", employee: employee});
      }
      client.close();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error getting employee' });
    }
  });


  router.put('/addSpeciality/:employeeId', async (req, res) => {
    try {
        const { employeeId } = req.params;
        const newSpeciality = req.body;
        const objectId = new ObjectId(employeeId);

        const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
        const db = client.db('finalexam');

        const employee = await db.collection('Employee').findOne({ '_id': objectId });
        if (!employee) {
            return res.status(404).json({ message: 'Employé non trouvé' });
        }
        employee.speciality.push(newSpeciality);
        await db.collection('Employee').updateOne({ '_id': objectId }, { $set: { speciality: employee.speciality } });

        client.close();

        return res.status(200).json({ message: 'Spécialité ajoutée avec succès à l\'employé' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erreur lors de l\'ajout de la spécialité à l\'employé' });
    }
});



router.get('/checkSpecialityExistence/:employeeId/:specialityId', async (req, res) => {
  try {
      const { employeeId, specialityId } = req.params;
      console.log(req.params);
      const objectId = new ObjectId(employeeId);

      const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
      const db = client.db('finalexam');

      const employee = await db.collection('Employee').findOne({ '_id': objectId });
      if (!employee) {
          return res.status(404).json({ error: 'Employee not found' });
      }

      const existingSpeciality = employee.speciality.find(spec => spec._id.toString() === specialityId);
      if (existingSpeciality) {
          return res.json({ exists: true }); 
      } else {
          return res.json({ exists: false }); 
      }
      client.close();
  } catch (error) {
      console.error('Error checking speciality existence:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/infoByEmployee/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;

    const objectId = new ObjectId(employeeId);

    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');

    const infos = await db.collection('Employee').find({
      '_id': objectId
    }).toArray();

    // console.log(req.params);
    // console.log(infos);
    res.json(infos);
    client.close();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la récupération des employés' });
  }
});


router.delete('/deleteSpeciality/:employeeId/:specialityId', async (req, res) => {
  try {
    const { employeeId, specialityId } = req.params;
    const employeeObjectId = new ObjectId(employeeId);

    const client = await MongoClient.connect(connectionString, { useUnifiedTopology: true });
    const db = client.db('finalexam');

    const result = await db.collection('Employee').updateOne(
      { _id: employeeObjectId },
      { $pull: { speciality: { _id: specialityId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Speciality not found for the employee' });
    }

    res.json({ success: true });
    client.close();
  } catch (error) {
    console.error('Error deleting speciality:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});






module.exports = router;
