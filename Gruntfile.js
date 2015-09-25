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
                src: ['js-libs/easeljs-NEXT.min.js', 'js-libs/color.js', 'js-libs/colors.min.js', 'js/maths.js', 'js/helpers.js', 'js/avatar-<%= pkg.version %>.js', 'js/avatar-options.js', 'js/avatar-textures.js',
                    'js/avatar-lines.js', 'js/avatar-hair.js', 'js/avatar-beard.js', 'js/races/ogre.js', 'js/races/navi.js', 'js/races/demon.js'],
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
        },
        jasmine: {
            avatar: {
                src: 'build/avatar.min.js',
                options: {
                    specs: 'tests/*.spec.js',
                    helpers: 'tests/helpers/*.js',
                    vendor: [
                        "js-libs/jquery-1.11.3.min.js",
                        "js-libs/bootstrap.min.js",
                        "js-libs/underscore-min.js",
                        "js-libs/underscore.string.min.js"
                    ],
                    phantomJSOptions: { //TODO: These aren't getting processed
                        page: {
                            viewportSize: {
                                width: 680,
                                height: 800
                            }
                        }
                    }
                }
            }
        },
        replace: {
            version: {
                src: ['js/avatar.js'],
                dest: 'js/avatar-<%= pkg.version %>.js',
                replacements: [
                    {
                        from: "version = 'X.X.X',",
                        to: "version = '<%= pkg.version %>',"
                    },
                    {
                        from: "summary = 'X',",
                        to: "summary = '<%= pkg.summary %>',"
                    }
                ]
            }
        }
    });

    // Load the plugin that provides the tasks.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-text-replace');

    // Default task(s).
    grunt.registerTask('default', ['replace', 'concat', 'uglify', 'jasmine']);

};
