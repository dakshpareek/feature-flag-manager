const express = require('express');
const httpStatus = require('http-status');
const _ = require('lodash');

const swaggerRouter = require('./swagger/swagger.route');
const {
  apiV1RateLimiter,
} = require('../../middlewares/apiRateLimit.middleware');

const apiV1Router = express.Router();

apiV1Router.get('/', (req, res) => {
  res.status(httpStatus.OK).json({
    status: 'success',
    message: 'Healthy check completed successfully',
  });
});

const defaultRoutes = [];

const devRoutes = [
  {
    path: '/documentation',
    route: swaggerRouter,
  },
];

_.forEach(defaultRoutes, (route) => {
  apiV1Router.use(apiV1RateLimiter);
  apiV1Router.use(route.path, route.route);
});

if (process.env.NODE_ENV === 'development') {
  _.forEach(devRoutes, (route) => {
    apiV1Router.use(apiV1RateLimiter);
    apiV1Router.use(route.path, route.route);
  });
}

module.exports = { apiV1Router };
