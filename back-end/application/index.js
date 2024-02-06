const express = require('express');
const app = express();
const port = 3000;

const customerRoutes = require('./routes/customerRoutes');
const expensesRoutes = require('./routes/expenseRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

app.use('/api/customers', customerRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/services', serviceRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
