require('./config/vars');

const express = require('express');

const { morganMiddleware } = require('./config/morgan');

/**
 * Initialize express app
 */
const app = express();

// logger middleware
app.use(morganMiddleware);

module.exports = app;
