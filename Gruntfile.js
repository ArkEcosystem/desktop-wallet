module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      vendor: {
        src: ['client/app/index.js'],
        dest: 'client/dist/vendor.js',
        options: {
          browserifyOptions: {
            insertGlobals: true,
            detectGlobals: true,
            debug: true,
            paths: ['./node_modules', './client/node_modules']
          },
          transform: [
            ['brfs']
          ],
          require: ['angular', 'angular-animate', 'angular-aria', 'bip39', 'angular-gettext', 'angular-material', 'angular-material-data-table', 'angular-messages', 'qrcode-generator', 'angular-qrcode',
            'angular-ui-router', 'arkjs', 'jsqr'],
          alias: {
            packageJson: './package.json'
          }
        }
      },
      client: {
        src: ['client/app/app.js', 'client/app/src/accounts/accounts.js', 'client/app/src/addressbook/addressbook.js',
          'client/app/src/coreServices/coreServices.js', 'client/app/src/coreUtils/acoreUtils.js',
          'client/app/src/qrScanner/qrScanner.js', 'client/app/src/**/*.js'],
        dest: 'client/dist/app.js',
        options: {
          browserifyOptions: {
            ignoreMissing: true,
            insertGlobals: true,
            detectGlobals: true,
            bare: true,
            debug: false
          },
          transform: [
            ['brfs']
          ],
          external: ['angular', 'angular-animate', 'angular-aria', 'angular-gettext', 'angular-material', 'angular-material-data-table', 'angular-messages', 'qrcode-generator', 'angular-qrcode',
            'angular-ui-router', 'arkjs', 'jsqr', 'packageJson', 'bip39']

        }
      }
    },
    clean: ['client/dist'],
    connect: {
      server: {
        options: {
          port: 9001,
          base: 'client/dist'
        }
      }
    },
    copy: {
      html: {
        files: [
          // includes files within path
          { expand: true, cwd: 'client/app/', src: ['**/*.html'], dest: 'client/dist/' }
        ]
      },
      css: {
        files: [
          // includes files within path
          { src: 'client/app/src/app.css',
            dest: 'client/dist/assets/css/app.css' }
        ]
      },
      assets: {
        files: [
          // includes files within path
          { expand: true, cwd: 'client/app/assets/', src: ['**/*'], dest: 'client/dist/assets/' },
          { src: 'client/node_modules/angular-material/angular-material.min.css',
            dest: 'client/dist/assets/css/angular-material.min.css' },
          { src: 'client/node_modules/angular-material-data-table/dist/md-data-table.min.css',
            dest: 'client/dist/assets/css/md-data-table.min.css' },
          { src: 'client/app/ark.png',
            dest: 'client/dist/ark.png' }
        ]
      }
    },
    eslint: {
      target: ['Gruntfile.js', 'client/app/src/**/*.js']
    },
    htmllint: {
      options: {},
      src: [
        'client/app/src**/*.html',
        'client/app/index.html'
      ]
    },
    uglify: {
      options: {
        mangle: {
          reserved: ['jQuery']
        }
      },

      vendor: {
        files: {
          'client/dist/vendor.min.js': ['client/app/assets/**/*.js']
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      js: {
        files: ['<%= eslint.target %>'],
        tasks: ['browserify:client']
      },
      html: {
        files: ['<%= htmllint.src %>'],
        tasks: ['copy:html']
      },
      css: {
        files: ['client/app/src/app.css'],
        tasks: ['copy:css']
      }
    },
    nggettext_extract: {
      pot: {
        files: {
          'po/template.pot': ['client/app/index.html', 'client/app/src/**/*.html', 'client/app/src/**/*.js']
        }
      }
    },
    nggettext_compile: {
      all: {
        files: {
          'client/app/src/coreUtils/translationsRun.js': ['po/*.po']
        }
      }
    }
  });

  grunt.registerTask('default', ['nggettext_compile']);
  grunt.registerTask('test', ['eslint']);
  grunt.registerTask('build', ['clean', 'browserify', 'copy']);
  grunt.registerTask('dev', ['clean', 'browserify', 'copy', 'connect:server', 'watch']);
};
