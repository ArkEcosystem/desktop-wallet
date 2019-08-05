const path = require('path')

module.exports = {
  verbose: false,
  rootDir: path.resolve(__dirname, '../'),
  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],
  moduleNameMapper: {
    '^@tailwind': '<rootDir>/tailwind.config.js',
    '^@package.json$': '<rootDir>/package.json',
    '^@config': '<rootDir>/config/index.js',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@/(.*)$': '<rootDir>/src/renderer/$1',
    '^@tests/(.*)$': '<rootDir>/__tests__/$1',
    vue$: '<rootDir>/node_modules/vue/dist/vue.common.js'
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'jest-vue-preprocessor'
  },
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/e2e',
    '<rootDir>/__tests__/unit.jest.conf.js',
    '<rootDir>/__tests__/unit/.coverage',
    '<rootDir>/__tests__/unit/__fixtures__',
    '<rootDir>/__tests__/unit/__mocks__',
    '<rootDir>/__tests__/unit/__utils__'
  ],
  setupFiles: [
    '<rootDir>/__tests__/unit/__utils__/setup.js'
  ],
  snapshotSerializers: ['jest-serializer-vue'],
  coverageDirectory: '<rootDir>/__tests__/unit/.coverage',
  collectCoverageFrom: [
    'src/renderer/**/*.{js,vue}'
  ],
  setupFilesAfterEnv: ['jest-extended'],
  watchman: false
}
