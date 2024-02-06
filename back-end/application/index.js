const express = require('express');
const app = express();
const port = 3000;

const customerRoutes = require('./routes/customerRoutes');
const expensesRoutes = require('./routes/expenseRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const specialOfferRoutes = require('./routes/specialOfferRoutes');
const preferenceRoutes = require('./routes/preferenceRoutes');

app.use('/api/customers', customerRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/specialOffers', specialOfferRoutes);
app.use('/api/preferences', preferenceRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
