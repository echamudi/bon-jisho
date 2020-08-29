// Sync object
module.exports = {
  testMatch: [
    '**/lib/**/?(*.)+(spec|test).[jt]s?(x)',
    '**/src/main/**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  verbose: true,
  transform: { '^.+\\.[jt]s$': '<rootDir>/jest-preprocess.js' },
};
