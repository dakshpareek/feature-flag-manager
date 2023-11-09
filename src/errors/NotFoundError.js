const CustomError = require("./CustomError");

class NotFoundError extends CustomError {
    constructor(message) {
        super(404, message);
    }
}

module.exports = { NotFoundError };
