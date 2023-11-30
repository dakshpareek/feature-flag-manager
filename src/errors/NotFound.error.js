const httpStatus = require('http-status');
const CustomError = require('./CustomError.error');

class NotFoundError extends CustomError {
  constructor(message) {
    super(httpStatus.NOT_FOUND, message);
  }
}

module.exports = { NotFoundError };
