const CustomError = require('./CustomError.error');

class NotFoundError extends CustomError {
  constructor(message) {
    super(404, message);
  }
}

module.exports = { NotFoundError };
