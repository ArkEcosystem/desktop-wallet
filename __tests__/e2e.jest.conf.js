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
    '^@pages/(.+)$': '<rootDir>/__tests__/e2e/__pages__/$1',
    '^@package.json$': '<rootDir>/package.json'
  },
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/e2e.jest.conf.js',
    '<rootDir>/__tests__/e2e/__actions__',
    '<rootDir>/__tests__/e2e/__pages__',
    '<rootDir>/__tests__/e2e/__utils__',
    '<rootDir>/__tests__/unit'
  ],
  setupFilesAfterEnv: ['jest-extended'],
  watchman: false
}
