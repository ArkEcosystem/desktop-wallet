const path = require('path')

module.exports = {
  verbose: false,
  rootDir: path.resolve(__dirname, '../'),
  moduleFileExtensions: [
    'js',
    'json'
  ],
  moduleNameMapper: {
    '^@setup$': '<rootDir>/__tests__/e2e/__utils__/setup.js',
    '^@package.json$': '<rootDir>/package.json'
  },
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/e2e.jest.conf.js',
    '<rootDir>/__tests__/e2e/__utils__',
    '<rootDir>/__tests__/e2e/pages',
    '<rootDir>/__tests__/unit'
  ],
  setupFilesAfterEnv: ['jest-extended'],
  watchman: false
}
