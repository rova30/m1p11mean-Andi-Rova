const express = require('express');
const app = express();
const port = 3000;



app.listen(port, () => {
  console.log(`Serveur Express en cours d'exécution sur le port ${port}`);
});
