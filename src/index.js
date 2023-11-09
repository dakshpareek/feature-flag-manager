require('./config/vars');

const express = require('express');

const { morganMiddleware } = require('./middlewares/morgan');
const errorHandleMiddleware = require("./middlewares/errorHandler");
const { NotFoundError } = require("./errors/NotFoundError");

/**
 * Initialize express app
 */
const app = express();

// logger middleware
app.use(morganMiddleware);

/**
 * Catchall middleware. Activate to serve every route in throw an error if the route is not found
 */
app.all('*', () => {
    throw new NotFoundError('Route not found');
});

/**
 * Global Error handler middleware
 */
app.use(errorHandleMiddleware);

module.exports = app;
