const httpStatus = require('http-status');
const CustomError = require('./CustomError.error');

class RedisConnectionError extends CustomError {
    constructor(message) {
        super(httpStatus.INTERNAL_SERVER_ERROR, message || 'Failed to connect to Redis');
    }
}

// Add other related errors for RedisClient if needed

module.exports = {
    RedisConnectionError,
    // Add other error classes here
};
