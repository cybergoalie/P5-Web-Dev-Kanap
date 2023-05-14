// Importing required dependencies
const express = require('express');
const path = require('path');

// Importing the product routes
const productRoutes = require('./routes/product');

// Creating a new instance of the Express framework
const app = express();

// Middleware for handling CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Serving static files from the 'images' directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Serving static files from the 'images' directory
app.use(express.static('images'));

// Middleware for parsing incoming request bodies
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Mounting the product routes to the '/api/products' path
app.use('/api/products', productRoutes);

// Exporting the app instance for use in other modules
module.exports = app;
