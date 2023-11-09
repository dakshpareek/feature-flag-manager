const http = require('http');
const app = require('../index');

const port = process.env.PORT || 80;

app.set('port', port);

const server = http.createServer(app);

const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
    console.log(`Listening on ${bind}`);
    console.log(`🚀 Server listening on port ${bind}`);
}

server.listen(port);
server.on('listening', onListening);
