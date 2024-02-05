const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Connexion à la base de données
mongoose.connect('mongodb+srv://webavanceem1:final@clusterm1.kqgspnb.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
// Gestion des erreurs de connexion
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur de connexion à MongoDB :'));
db.once('open', () => {
  console.log('Connexion à MongoDB Atlas établie avec succès');
});

// Définir des routes et des gestionnaires ici
app.listen(port, () => {
  console.log(`Serveur Express en cours d'exécution sur le port ${port}`);
});

