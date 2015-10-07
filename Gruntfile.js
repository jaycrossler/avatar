// Generated on <%= (new Date).toISOString().split('T')[0] %> using
// <%= pkg.name %> <%= pkg.version %>
'use strict';

var libraryFiles = ['js-libs/color.js', 'js-libs/colors.min.js', 'js/maths.js', 'js/helpers.js'];
var avatarFiles = [ 'js/avatar.js', 'js/avatar-*.js'];
var contentFiles = ['js/content_packs/**/manifest.js'];
var raceFiles = [ 'js/races/*.js'];
var dropbox_root = '/Users/jcrossler/Dropbox/Public/sites/avatar/';
var cordova_root = '/Users/jcrossler/Sites/avatar-mobile/platforms/ios/www/';

var screenshot_count = 12;
var allFiles = libraryFiles.concat(avatarFiles, contentFiles, raceFiles);

function screenshots_list(version) {
    var output = {};
    for (var i = 1; i <= screenshot_count; i++) {
        var options = '';
        if (i > screenshot_count-2) {
            options += "&points=true";
        }
        if (i % 3 == 1) {
            options += "&bg=gold";
        }
        if (i % 3 == 2) {
            options += "&bg=lightyellow";
        }

        output['avatar_' + i] = {
            options: {
                url: 'http://localhost:9001/examples/avatar_from_seed.html?seed=' + i + '&hide=true'+options,
                output: 'images/screenshots/' + version + '/avatar-seed-' + i
            }
        };
    }
    return output;
}

module.exports = function (grunt) {

    var banner = '/*\n'+
                 '-----------------------------------------------------------------------------------\n' +
                 '-- <%= pkg.name %>.js - v<%= pkg.version %> - Built on <%= grunt.template.today("yyyy-mm-dd") %> by <%= pkg.author %> using Grunt.js\n' +
                 '-----------------------------------------------------------------------------------\n' +
                 '-- Packaged with color.js - Copyright (c) 2008-2013, Andrew Brehaut, Tim Baumann, \n' +
                 '--                          Matt Wilson, Simon Heimler, Michel Vielmetter\n'+
                 '-- colors.js - Copyright 2012-2013 Matt Jordan - https://github.com/mbjordan/Colors \n' +
                 '-----------------------------------------------------------------------------------\n' +
                 ' color.js: */\n';

    // Project configuration.
    var config = {
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n',
                banner: banner
            },
            build: {
                src: allFiles,
                dest: 'build/<%= pkg.name %>-<%= pkg.version %>.js'
            },
            quick: {
                src: allFiles,
                dest: 'build/avatar.min.js'
            }

        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %>.js - <%= pkg.name %>, Minified on <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                sourceMap: true
            },
            build: {
                src: 'build/<%= pkg.name %>-<%= pkg.version %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },
        jasmine: {
            build: {
                src: 'build/avatar.min.js',
                options: {
                    specs: 'tests/*.spec.js',
                    helpers: 'tests/helpers/*.js',
                    vendor: [
                        "js-libs/jquery-1.11.3.min.js",
                        "js-libs/bootstrap.min.js",
                        "js-libs/underscore-min.js",
                        "js-libs/underscore.string.min.js",
                        "js-libs/easeljs-NEXT.min.js"
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
        notify: {
            build: {
                options: {
                    title: "Avatar Compiled",
                    message: "Files saved and minified and merged"
                }
            },
            quick: {
                options: {
                    title: "Avatar Quick Compiled",
                    message: "Files merged"
                }
            }

        },
        watch: {
            avatar: {
                files: ['**/*.js'],
                tasks: ['concat:quick']
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001
                }
            },
            live: {
                options: {
                    keepalive: true,
                    port: 9002
                }
            }
        },
        copy: {
            dropbox: {
                files: [
                    {expand: true, src: ['build/**'], dest: dropbox_root},
                    {expand: true, src: ['css/**'], dest: dropbox_root},
                    {expand: true, src: ['examples/**'], dest: dropbox_root},
                    {expand: true, src: ['images/**'], dest: dropbox_root},
                    {expand: true, src: ['js/**'], dest: dropbox_root},
                    {expand: true, src: ['js-libs/**'], dest: dropbox_root},
                    {expand: false, src: ['index.html'], dest: dropbox_root}
                ]
            },
            cordova: {
                files: [
                    {expand: true, src: ['build/**'], dest: cordova_root},
                    {expand: true, src: ['css/**'], dest: cordova_root},
                    {expand: true, src: ['examples/**'], dest: cordova_root},
                    {expand: true, src: ['images/**'], dest: cordova_root},
                    {expand: true, src: ['js/**'], dest: cordova_root},
                    {expand: true, src: ['js-libs/**'], dest: cordova_root},
                    {expand: false, src: ['index.html'], dest: cordova_root}
                ]
            }

        },
        replace: {
            version: {
                src: ['js/avatar.js'],
                overwrite: true,
                replacements: [
                    {
                        from: new RegExp("version = '(.*?)',"),
                        to: "version = '<%= pkg.version %>',"
                    },
                    {
                        from: new RegExp("summary = '(.*?)',"),
                        to: "summary = '<%= pkg.summary %>',"
                    }
                ]
            },
            index: {
                src: ['index.html'],
                overwrite: true,
                replacements: [
                    {
                        from: new RegExp('<.*?id="summary".*?>(.*?)</.*?>'),
                        to: '<h2 id="summary"><%= pkg.summary %></h2>'
                    },
                    {
                        from: new RegExp('<.*?id="description".*?>(.*?)</.*?>'),
                        to: '<p id="description" class="lead"><%= pkg.description %></p>'
                    },
                    {
                        from: new RegExp('<button.*?id="version".*?>(.*?)</button>'),
                        to: '<button type="button" class="btn btn-info btn-xs" id="version">version <%= pkg.version %></button>'
                    }
                ]
            },
            screenshots: {  //TODO: Get this working with all images in directory, not always current version
                src: ['images/screenshots/index.tpl.html'],
                dest: ['images/screenshots/index.html'],
                replacements: [
                    {
                        from: '<div id="screenshot-list"></div>',
                        to: function () {
                            var versions = ['0.0.9', '0.0.8', '0.0.7'];
                            var list = "";
                            var list_js = "";
                            for (var v = 0; v < versions.length; v++) {
                                var version = versions[v];
                                var ver_link = '(link to <a href="../../build/avatar-'+version+'.js">avatar-'+version+'.js</a>)';
                                list += '<p><b>Screenshots of Avatars from Version ' + version + ' ' + ver_link + ':</b></p>\n';
                                for (var i = 1; i <= screenshot_count; i++) {
                                    var name = version + '/avatar-seed-' + i + '.png';
                                    list += '<a id="popover_'+i+'" class="btn" rel="popover" data-content="" title="Avatar.js auto-generated image"><img style="width:200px;height:200px" src="' + name + '"></a>\n';

                                    var img = '<img src="'+name+'">';
                                    list_js += "$('#popover_"+i+"').popover({trigger:'hover', placement:'bottom', content: '" + img + "', html: true});\n";

                                }
                            }
                            var output = '<div id="screenshot-list">\n' + list + '</div>';
                            output += "\n<scr" + "ipt>\n" +
                                      "$(function(){\n" +
                                      list_js + "\n" +
                                      "});\n</scr" + "ipt>";

                            return output;
                        }
                    }
                ]
            }
        }
    };
    config.screenshots = screenshots_list('<%= pkg.version %>');
    grunt.initConfig(config);

    grunt.loadTasks('tasks');

    // Load the plugin that provides the tasks.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['replace:index', 'replace:version', 'concat:build', 'uglify:build', 'jasmine', 'notify:build', 'connect:server', 'screenshots', 'replace:screenshots']);
    grunt.registerTask('quick', ['concat:quick', 'notify:quick', 'jasmine']);
    grunt.registerTask('server', ['concat:quick', 'notify:quick', 'connect:live']);
    grunt.registerTask('dropbox', ['copy:dropbox']);
    grunt.registerTask('cordova', ['copy:cordova']);
    grunt.registerTask('shots', ['connect:server', 'screenshots', 'replace:screenshots']);

    grunt.task.run('notify_hooks');

};
