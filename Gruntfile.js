module.exports = function(grunt) {
  require("load-grunt-tasks")(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015']
      },
      dist: {
        files: {
          'client/dist/app.js': ['client/app/src/**/*.js', 'client/app/app.js']
        }
      }
    },
    eslint: {
      target: ['Gruntfile.js', 'client/app/src/**/*.js',],
    },
    htmllint: {
      options: {},
      src: [
        'client/app/src**/*.html'
      ],
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
      js: {
        files: ['<%= eslint.target %>'],
        tasks: ['eslint']
      },
      html: {
        files: ['<%= htmllint.src %>'],
        tasks: ['htmllint']
      }
    },
    nggettext_extract: {
      pot: {
        files: {
          'po/template.pot': ['client/app/index.html','client/app/src/**/*.html','client/app/src/**/*.js']
        }
      },
    },
    nggettext_compile: {
      all: {
        files: {
          'client/app/src/translations.js': ['po/*.po']
        }
      },
    }
  });

  grunt.registerTask('default', ['nggettext_compile']);
  grunt.registerTask('test', ['eslint']);
  grunt.registerTask('bundle', ['babel:dist','uglify']);


};
