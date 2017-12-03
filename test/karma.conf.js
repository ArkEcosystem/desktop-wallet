'use strict'

module.exports = function (config) {
  config.set({

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '',

    browsers: ['Electron'],
    // browsers: ['DebugElectron'],

    // Options: https://github.com/karma-runner/karma-coverage
    coverageReporter: {
      reporters: [
        { type: 'text', dir: '.coverage' }
        // Uncomment for generating HTML reports
        // { type: 'html', dir: '.coverage' },
      ]
    },

    color: true,

    // list of files / patterns to load in the browser (the order matters)
    files: [
      '../client/node_modules/angular/angular.js',
      '../client/node_modules/angular-gettext/dist/angular-gettext.js',
      '../client/node_modules/angular-animate/angular-animate.js',
      '../client/node_modules/angular-aria/angular-aria.js',
      '../client/node_modules/angular-material/angular-material.js',

      // Subjects under test
      '../client/app/src/init.js',
      '../client/app/src/accounts/account.service.js',
      '../client/app/src/accounts/account.controller.js',
      '../client/app/src/addons/pluginLoader.addon.js',
      '../client/app/src/components/**/*.js',
      '../client/app/src/filters/filters.js',
      '../client/app/src/services/**/*.js',
      '../client/app/src/utils/translations.js',

      // Inject the `module` function
      '../node_modules/angular-mocks/angular-mocks.js',

      // Tests
      'accounts/**/*.js',
      'components/**/*.js',
      'services/**/*.js'
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
      '../client/app/**/*.js': ['electron'],
      '../client/app/src/**/*.js': ['electron', 'babelSourceMap', 'coverage'],
      './**/*.js': ['electron', 'babelSourceMap']
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
    singleRun: false,

    client: {
      useIframe: false,
      __filenameOverride: __dirname + '/../client/app/index.html'
    },

    customLaunchers: {
      DebugElectron: {
        base: 'Electron',
        flags: [
          '--show',
          '--enable-logging'
        ]
      }
    }
  })
}
