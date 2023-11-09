const http = require('http');
const app = require('../index');
const Logger = require('../config/logger');

const port = process.env.PORT || 8080;

app.set('port', port);

const server = http.createServer(app);

const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
    Logger.debug(`Listening on ${bind}`);
    Logger.info(`🚀 Server listening on port ${bind}`);
}

server.listen(port);
server.on('listening', onListening);
