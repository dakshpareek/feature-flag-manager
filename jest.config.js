module.exports = {
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  clearMocks: true,
  restoreMocks: true,
  collectCoverage: false,
  collectCoverageFrom: ['src/**/([a-zA-Z_]*).{js,ts}', '!**/*.test.{js,ts}'],
};
