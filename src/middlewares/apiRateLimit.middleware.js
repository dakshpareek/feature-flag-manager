const rateLimit = require('express-rate-limit');

// Constants for better readability
const WINDOW_MS = 1 * 60 * 1000; // 1 minute

// Default rate limiter configuration
const defaultRateLimiterConfig = {
  windowMs: WINDOW_MS,
  standardHeaders: true,
  legacyHeaders: false,
  message: async (req, res) => res.status(429).json({
    status: 'error',
    message: 'Rate limit exceeded!',
  }),
};

// Environment-specific rate limiter configurations
const environmentConfigs = {
  development: {
    ...defaultRateLimiterConfig,
    max: 100, // Adjust the limit for development
  },
  test: {
    ...defaultRateLimiterConfig,
    max: 500, // Adjust the limit for testing
  },
  production: {
    ...defaultRateLimiterConfig,
    max: 200, // Adjust the limit for production
  },
};

// Determine the current environment
const currentEnvironment = process.env.NODE_ENV;

// Select the appropriate rate limiter configuration based on the environment
const selectedRateLimiterConfig = environmentConfigs[currentEnvironment];

// Create rate limiter
const apiV1RateLimiter = rateLimit(selectedRateLimiterConfig);

module.exports = {
  apiV1RateLimiter,
};
