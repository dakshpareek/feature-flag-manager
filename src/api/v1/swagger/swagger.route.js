const { Router } = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const swaggerRouter = Router();

const options = {
  explorer: true,
};

swaggerRouter.use('/', swaggerUi.serve);
swaggerRouter.get('/', swaggerUi.setup(swaggerDocument, options));

module.exports = swaggerRouter;
