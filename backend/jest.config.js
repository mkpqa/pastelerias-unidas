module.exports = {
  testEnvironment: 'node',
  testTimeout: 30000,
  setupFiles: ['./tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  forceExit: true,
};
