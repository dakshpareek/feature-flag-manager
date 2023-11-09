/**
 * This middleware is responsible for returning a json every time
 * an error comes in. We use in the index.ts as global middleware
 */

const Logger = require('./logger');

const errorHandleMiddleware = (err, req, res, next) => {
    const isProduction = process.env.NODE_ENV === 'production';
    let errorMessage = {};

    if (res.headersSent) {
        return next(err);
    }

    if (!isProduction) {
        Logger.debug(err.stack);
        errorMessage = err;
    }

    if (err) {
        return res.status(err.statusCode || 500).json({
            status: 'error',
            statusCode: err.statusCode,
            message: err.message,
            error: {
                message: err.message,
                ...(!isProduction && {trace: errorMessage}),
            },
        });
    }
};

module.exports = errorHandleMiddleware;
