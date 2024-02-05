const express = require('express');
const app = express();
const port = 3000;

// Définir des routes et des gestionnaires ici

app.listen(port, () => {
  console.log(`Serveur Express en cours d'exécution sur le port ${port}`);
});

app.get('/', (req, res) => {
    res.send('Salama boss !');
});