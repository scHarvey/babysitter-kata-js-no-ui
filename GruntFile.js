module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['temp', 'build'],
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['src/**/*.js', '!src/__tests__/**/*.js'],
        dest: 'tmp/<%= pkg.name %>.js'
      }
    },
    babel: {
  		options: {
  			sourceMap: true,
  			presets: ['es2015']
  		},
  		dist: {
  			files: {
  				'build/<%= pkg.name %>.js': 'tmp/<%= pkg.name %>.js'
  			}
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
  grunt.registerTask('default', ['clean', 'concat', 'babel', 'uglify']);
}
