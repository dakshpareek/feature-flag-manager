const http = require('http');
const app = require('../index');
const Logger = require('../middlewares/logger.middleware');
const { assertDatabaseConnectionOk } = require('../helpers/sequelize');

const port = process.env.PORT || 8080;

app.set('port', port);

let server;

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      Logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      Logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
  Logger.debug(`Listening on ${bind}`);
  Logger.info(`🚀 Server listening on port ${bind}`);
};

const startServer = async () => {
  try {
    await assertDatabaseConnectionOk();

    server = http.createServer(app);

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  } catch (e) {
    Logger.error('Error starting the server:', e);
    process.exit(1);
  }
};

startServer().then();
