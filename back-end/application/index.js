const express = require('express');
const app = express();
const port = 3000;

const customerRoutes = require('./routes/customerRoutes');

// this is the prefix eny @url avant de faire le post
app.use('/api/customers', customerRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

