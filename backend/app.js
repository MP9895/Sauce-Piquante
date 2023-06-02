const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');

//import des routes
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce');

//création de l'application
const app = express();

require('./config/db')();

  app.use((req, res, next) => 
  {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      next();
  });

app.use(express.json());

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
    xDownloadOptions: false,
  })
);

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;