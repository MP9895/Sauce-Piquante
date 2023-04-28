const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://mp95:i205gEyDjI3Gb40b@piquante.ubdissx.mongodb.net/test',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
   // on indique que les ressources peuvent être partagées depuis n'importe quelle origine
   res.setHeader('Access-Control-Allow-Origin', '*');
   // on indique les entêtes qui seront utilisées après la pré-vérification cross-origin afin de donner l'autorisation
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   // on indique les méthodes autorisées pour les requêtes HTTP
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   // on autorise ce serveur à fournir des scripts pour la page visitée
   res.setHeader('Content-Security-Policy', "default-src 'self'");
   next();
 });

module.exports = app;