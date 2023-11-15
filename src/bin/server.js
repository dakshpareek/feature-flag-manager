const http = require('http');
const app = require('../index');
const Logger = require('../middlewares/logger.middleware');

const port = process.env.PORT || 8080;

app.set('port', port);

const server = http.createServer(app);

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
        case 'EADDRINUSE':
            Logger.error(`${bind} is already in use`);
            process.exit(1);
        default:
            throw error;
    }
};

const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
    Logger.debug(`Listening on ${bind}`);
    Logger.info(`🚀 Server listening on port ${bind}`);
}

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
