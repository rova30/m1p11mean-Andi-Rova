// Importer les modules nécessaires
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Importer les routes
const customerRoutes = require('./routes/customerRoutes');
const expensesRoutes = require('./routes/expenseRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const managerRoutes = require('./routes/managerRoutes');
const specialOfferRoutes = require('./routes/specialOfferRoutes');
const preferenceRoutes = require('./routes/preferenceRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');

// Utiliser cors pour autoriser les requêtes de différents domaines
app.use(cors());

// Utiliser les routes dans l'application
app.use('/customers', customerRoutes);
app.use('/managers', managerRoutes);
app.use('/expenses', expensesRoutes);
app.use('/services', serviceRoutes);
app.use('/employees', employeeRoutes);
app.use('/specialOffers', specialOfferRoutes);
app.use('/preferences', preferenceRoutes);
app.use('/incomes', incomeRoutes);
app.use('/appointments', appointmentRoutes);

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
