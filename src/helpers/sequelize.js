const { Sequelize } = require('sequelize');
const Logger = require('../middlewares/logger.middleware');
const config = require('../config/database.config');

// Create a Sequelize instance with your database configurations
const sequelize = new Sequelize({
  ...config[process.env.NODE_ENV || 'development'],
  logging: (msg) => {
    Logger.debug(msg);
  },
});

// Test the database connection
async function assertDatabaseConnectionOk() {
  try {
    await sequelize.authenticate();
    Logger.info('Database connection OK!');
  } catch (error) {
    Logger.error('Unable to connect to the database:');
    Logger.error(error.message);
    process.exit(1);
  }
}

// Export the Sequelize instance to be used in other files
module.exports = { sequelize, assertDatabaseConnectionOk };
