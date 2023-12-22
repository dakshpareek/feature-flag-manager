const httpStatus = require('http-status');
const CustomError = require('./CustomError.error');

class FeatureFlagInitializationError extends CustomError {
    constructor(message) {
        super(httpStatus.INTERNAL_SERVER_ERROR, message || 'Failed to initialize FeatureFlagManager');
    }
}

class FeatureFlagConfigurationError extends CustomError {
    constructor(message) {
        super(httpStatus.INTERNAL_SERVER_ERROR, message || 'Failed to set configuration data');
    }
}

class FeatureFlagCacheError extends CustomError {
    constructor(message) {
        super(httpStatus.INTERNAL_SERVER_ERROR, message || 'Failed to load or cache default flags');
    }
}

// Add other related errors for FeatureFlagManager if needed

module.exports = {
    FeatureFlagInitializationError,
    FeatureFlagConfigurationError,
    FeatureFlagCacheError,
    // Add other error classes here
};
