'use strict'

module.exports = function(config) {
  config.set({

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '',

    browsers: [
      'PhantomJS',
      // + Chrome
      // + ChromeCanary
    ],

    // Options: https://github.com/karma-runner/karma-coverage
    coverageReporter: {
      reporters: [
        { type: 'text', dir: '.coverage' },
        // Uncomment for generating HTML reports
        // { type: 'html', dir: '.coverage' },
      ]
    },

    color: true,

    // list of files / patterns to load in the browser (the order matters)
    files: [
      '../client/node_modules/angular/angular.js',
      '../client/node_modules/angular-gettext/dist/angular-gettext.js',
      '../client/node_modules/angular-material/angular-material.js',
      '../node_modules/angular-mocks/angular-mocks.js',

      // Subjects under test
      '../client/app/src/init.js',
      '../client/app/src/accounts/account.service.js',
      '../client/app/src/addons/pluginLoader.addon.js',
      '../client/app/src/components/addressbook/addressbook.controller.js',
      '../client/app/src/filters/filters.js',
      '../client/app/src/services/changer.service.js',
      '../client/app/src/services/ledger.service.js',
      '../client/app/src/services/network.service.js',
      '../client/app/src/services/storage.service.js',
      '../client/app/src/services/time.service.js',
      '../client/app/src/utils/translations.js',

      // Tests
      'components/**/*.js',
      'services/*.js',
    ],

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['mocha', 'sinon-chai'],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    // port: 8080,

    // cli runner port
    // runnerPort: 9009,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    preprocessors: {
      '../client/app/src/**/*.js': ['babelSourceMap', 'coverage'],
      './**/*.js': ['babelSourceMap'],
    },

    customPreprocessors: {
      babelSourceMap: {
        base: 'babel',
        options: {
          presets: ['es2015'],
          sourceMap: 'inline'
        }
      }
    },

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'coverage'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false

  })
}
