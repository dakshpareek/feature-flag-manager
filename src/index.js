require('./config/vars');

const ruid = require('express-ruid');
const httpContext = require('express-http-context');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const { morganMiddleware } = require('./middlewares/morgan.middleware');
const errorHandleMiddleware = require('./middlewares/errorHandler.middleware');
const { NotFoundError } = require('./errors/NotFound.error');
const { apiV1Router } = require('./api/v1/index.route');

/**
 * Initialize express app
 */
const app = express();

// be sure to user the httpContext.middleware
app.use(httpContext.middleware);

// configure the 'setInContext' option to true
app.use(ruid({ setInContext: true }));

// trust proxy
app.set('trust proxy', true);

// secure apps by setting various HTTP headers
app.use(helmet());

// parse body request
app.use(express.json());

// parse urlencoded request
app.use(express.urlencoded({ extended: true }));

// use GZIP compression
app.use(compression());

// logger middleware
app.use(morganMiddleware);

// parse cookie
app.use(cookieParser());

// enable cors
app.use(cors());
app.options('*', cors());

app.use('/api/v1/', apiV1Router);

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
