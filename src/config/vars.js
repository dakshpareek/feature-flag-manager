const path = require('path');

require('dotenv-safe').config({
    path: path.join(__dirname, '../../.env'),
    example: path.join(__dirname, '../../.env.example'),
});

const sslConfig = {
    key: process.env.SSL_PRIVATE_KEY,
    cert: process.env.SSL_CERTIFICATE,
    ca: process.env.SSL_CA, // Optional: If you have a certificate authority (CA) bundle
};

module.exports = {
    sslConfig,
}
