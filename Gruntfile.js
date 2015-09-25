// Generated on <%= (new Date).toISOString().split('T')[0] %> using
// <%= pkg.name %> <%= pkg.version %>
'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';\n',
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            dist: {
                src: ['js-libs/easeljs-NEXT.min.js', 'js-libs/color.js', 'js-libs/colors.min.js', 'js/maths.js', 'js/helpers.js', 'js/avatar.js', 'js/avatar-options.js', 'js/avatar-textures.js',
                    'js/avatar-lines.js', 'js/avatar-hair.js', 'js/avatar-beard.js', 'js/races/ogre.js', 'js/races/navi.js'],
                dest: 'build/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %>.js - <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'build/<%= pkg.name %>-<%= pkg.version %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        }
    });

    // Load the plugin that provides the tasks.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    // Default task(s).
    grunt.registerTask('default', ['concat', 'uglify']);

};
