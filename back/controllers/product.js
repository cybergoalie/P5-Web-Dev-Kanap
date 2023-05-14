/**
 * A module that generates UUIDs (Universally Unique Identifiers) according to version 1 of the UUID standard.
 * @external uuid/v1
 * @see {@link https://www.npmjs.com/package/uuid|uuid/v1 package}
 */

/**
 * A module that defines the Product model used by the application.
 * @external Product
 * @see {@link ../models/Product|Product module}
 */

const uuid = require('uuid/v1');
const Product = require('../models/Product');

/**
 * Retrieve all products from the database and return them as a JSON response.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} - JSON response containing all products.
 */

exports.getAllProducts = (req, res, next) => {
  Product.find().then(
    (products) => {
      const mappedProducts = products.map((product) => {
        product.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + product.imageUrl;
        return product;
      });
      res.status(200).json(mappedProducts);
    }
  ).catch(
    () => {
      res.status(500).send(new Error('Database error!'));
    }
  );
};

/**
 * Retrieve a single product from the database and return it as a JSON response.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} - JSON response containing the requested product.
 */

exports.getOneProduct = (req, res, next) => {
  Product.findById(req.params.id).then(
    (product) => {
      if (!product) {
        return res.status(404).send(new Error('Product not found!'));
      }
      product.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + product.imageUrl;
      res.status(200).json(product);
    }
  ).catch(
    () => {
      res.status(500).send(new Error('Database error!'));
    }
  )
};

/**
 * Create a new order for the specified products and contact information.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Object} - JSON response containing the new order and order ID.
 * 
 * Expects request to contain:
 * contact: {
 *   firstName: string,
 *   lastName: string,
 *   address: string,
 *   city: string,
 *   email: string
 * }
 * products: [string] <-- array of product _id
 *
 */
exports.orderProducts = (req, res, next) => {
  // Check if all the required order details are present in the request body
  if (!req.body.contact ||
      !req.body.contact.firstName ||
      !req.body.contact.lastName ||
      !req.body.contact.address ||
      !req.body.contact.city ||
      !req.body.contact.email ||
      !req.body.products) {
    // If any of the required details are missing, return a 400 error response
    return res.status(400).send(new Error('Bad request!'));
  }
  let queries = [];
  for (let productId of req.body.products) {
    const queryPromise = new Promise((resolve, reject) => {
      // Find the product in the database by its ID
      Product.findById(productId).then(
        (product) => {
          if (!product) {
            // If product is not found, reject the promise with an error message
            reject('Product not found: ' + productId);
          }
          // Add the full image URL to the product object
          product.imageUrl = req.protocol + '://' + req.get('host') + '/images/' + product.imageUrl;
          // Resolve the promise with the updated product object
          resolve(product);
        }
      ).catch(
        () => {
          // If there's an error with the database query, reject the promise with an error message
          reject('Database error!');
        }
      )
    });
    queries.push(queryPromise);
  }
  // Once all the promises are resolved, create a new order object and return it as a JSON response
  Promise.all(queries).then(
    (products) => {
      // Generate a new order ID
      const orderId = uuid();
      // Return the order details as a JSON response
      return res.status(201).json({
        contact: req.body.contact,
        products: products,
        orderId: orderId
      })
    }
  ).catch(
    (error) => {
      // If there's any error with the promises, return a 500 error response
      return res.status(500).json(new Error(error));
    }
  );
};
