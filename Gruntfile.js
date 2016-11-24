module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'client/app/src/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
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

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-angular-gettext');

  grunt.registerTask('default', ['nggettext_compile']);

};
