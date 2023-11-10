require('./config/vars');

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const { morganMiddleware } = require('./middlewares/morgan');
const errorHandleMiddleware = require("./middlewares/errorHandler");
const { NotFoundError } = require('./errors/NotFoundError');

/**
 * Initialize express app
 */
const app = express();

// trust proxy
app.set('trust proxy', true);

// secure apps by setting various HTTP headers
app.use(helmet());

// parse body request
app.use(express.json());

// parse urlencoded request
app.use(express.urlencoded({extended: true}));

// use GZIP compression
app.use(compression());

// logger middleware
app.use(morganMiddleware);

// parse cookie
app.use(cookieParser());

// enable cors
app.use(cors());
app.options('*', cors());

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
