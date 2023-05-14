const http = require('http');
const app = require('./app');
/**
 * Normalize a port into a number, string, or false.
 *
 * @param {string} val - The port value to normalize.
 * @returns {(number|string|boolean)} - The normalized port value.
 */
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Normalize the port value
const port = normalizePort(process.env.PORT || '3000');

// Set the port value in the app
app.set('port', port);

/**
 * Event listener for HTTP server "error" event.
 *
 * @param {Error} error - The error object.
 */
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
    default:
      throw error;
  }
};

// Create the HTTP server
const server = http.createServer(app);

// Add error and listening event handlers
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// Listen on the specified port
server.listen(port);
