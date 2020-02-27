module.exports = {
  verbose: false,
  globals: {
    __static: __dirname,
    'vue-jest': {
      hideStyleWarn: true
    }
  },
  rootDir: require('path').resolve(__dirname, '../'),
  moduleFileExtensions: [
    'js',
    'ts',
    'tsx',
    'json',
    'vue'
  ],
  moduleNameMapper: {
    '^@tailwind': '<rootDir>/tailwind.js',
    '^@package.json$': '<rootDir>/package.json',
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@config': '<rootDir>/config/index.js',
    '^@/(.*)$': '<rootDir>/src/renderer/$1',
    '^@tests/(.*)$': '<rootDir>/__tests__/$1',
    vue$: '<rootDir>/node_modules/vue/dist/vue.common.js'
  },
  preset: 'ts-jest/presets/js-with-ts',
  transform: {
    '^.+\\.js$': 'babel-jest',
    '.*\\.vue$': 'vue-jest',
    '^.+\\.tsx?$': 'ts-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub'
  },
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/e2e',
    '<rootDir>/__tests__/unit.jest.conf.js',
    '<rootDir>/__tests__/unit/.coverage',
    '<rootDir>/__tests__/unit/__fixtures__',
    '<rootDir>/__tests__/unit/__mocks__',
    '<rootDir>/__tests__/unit/__utils__'
  ],
  snapshotSerializers: ['jest-serializer-vue'],
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
  coverageDirectory: '<rootDir>/__tests__/unit/.coverage',
  collectCoverageFrom: [
    'src/renderer/**/*.{js,ts,tsx,vue}'
  ],
  setupFilesAfterEnv: [
    'jest-extended',
    '<rootDir>/__tests__/unit/__utils__/setup.js'
  ],
  watchman: false
}
