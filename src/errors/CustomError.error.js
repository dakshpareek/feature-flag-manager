class CustomErrorError extends Error {
  constructor(statusCode, message) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.message = message;
    this.isOperational = true; // Indicates if this is a trusted error
  }

  toResponse() {
    return {
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}

module.exports = CustomErrorError;
