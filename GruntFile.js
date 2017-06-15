module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['tmp/**/*', '!tmp/.gitkeep', 'build/**/*', '!build/.gitkeep'],
    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015']
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['**/*.js', '!__tests__/**/*.js'],
          dest: 'tmp',
          ext: '.js'
        }]
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['tmp/**/*.js', '!tmp/__tests__/**/*.js'],
        dest: 'build/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */'
      },
      dist: {
        files: {
          'build/<%= pkg.name %>.min.js': ['build/<%= pkg.name %>.js']
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-babel');
  grunt.registerTask('default', ['clean', 'babel', 'concat', 'uglify']);
}
