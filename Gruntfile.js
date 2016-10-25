'use strict';

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    var timer = require('grunt-timer'),
        configs = {
            app: './src',
            tempPath: '.tmp',
            distPath: './dist',
            buildPath: grunt.option('path') || './build'
        };

    timer.init(grunt, {
        friendlyTime: false,
        color: 'blue'
    });

    grunt.initConfig({

        /************************************************************************
         * General Configurations
         ************************************************************************/

        config: configs,


        // Enviroment variables configurations
        env: {
            test: {
                NODE_ENV: 'test'
            },
            prod: {
                NODE_ENV: 'prod'
            }
        },

        imagemin: {
            dynamic: {
                optimizationLevel: 5,
                files: [
                    {
                        expand: true,
                        cwd: 'assets/images',
                        src: ['assets/sprites/sprites.png'],
                        dest: '<%= config.productionPath %>/assets/sprites/'
                    },
                    {
                        expand: true,
                        cwd: 'assets/imagesNoSprite',
                        src: ['**/*.{png,jpg,gif}'],
                        dest: '<%= config.productionPath %>/assets/imagesNoSprite/'
                    },
                    {
                        expand: true,
                        cwd: 'assets/images',
                        src: ['**/*.{png,jpg,gif}'],
                        dest: '<%= config.productionPath %>/assets/images/'
                    }
                ]
            }
        },

        sprite: {
            all: {
                src: 'assets/images/**/*.png',
                dest: 'assets/sprites/sprites.png',
                destCss: 'assets/css/sprites.css',
                padding: 5
            },
            build: {
                src: 'assets/images/**/*.png',
                dest: 'assets/sprites/sprites.png',
                destCss: 'assets/css/sprites.css'
            },
            prod: {
                src: '<%= config.app %>/assets/images/**/*.png',
                dest: '<%= config.productionPath %>/assets/sprites/sprites.png',
                destCss: 'assets/css/sprites.css',
                imgPath: '../assets/sprites/sprites.png'
            }
        },

        // Compile Stylus files into CSS files
        sass: {
            options: {
                sourceMap: true
            },
            build: {
                files: {
                    '<%= config.buildPath %>/css/main.css': '<%= config.app %>/scss/main.scss'
                }
            }
        },


        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({browsers: 'Chrome >= 20, Firefox >= 20, Safari >= 8, Explorer >= 10'})
                ]
            },
            build: {
                src: '<%= config.buildPath %>/css/main.css'
            },
            prod: {
                src: '<%= config.app %>/css/main.css'
            }
        },


        // SCSS lint
        scsslint: {
            allFiles: [
                '<%= config.app %>/app/**/*.scss',
                '<%= config.app %>/assets/scss/*.scss',
                '<%= config.app %>/components/**/*.scss'
            ],
            options: {
                colorizeOutput: true,
                maxBuffer: 2000 * 1024,
                config: '<%= config.app %>/.scss-lint.yml'
            }
        },


        // Remove desired directories
        clean: {
            build: {
                src: [
                    '<%= config.tempPath %>',
                    '<%= config.distPath %>',
                    '<%= config.buildPath %>'
                ]
            },
            prod: {
                options: {
                    force: true
                },
                src: [
                    '<%= config.tempPath %>',
                    '<%= config.distPath %>',
                    '<%= config.buildPath %>',
                    '<%= config.productionPath %>'
                ]
            },
            after: {
                src: [
                    '<%= config.app %>/js',
                    '<%= config.app %>/css',
                    '<%= config.tempPath %>',
                    '<%= config.distPath %>'
                ]
            }
        },


        // Copy files to a desired location
        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.app %>/',
                        src: ['index.html'],
                        dest: '<%= config.buildPath %>/',
                        flatten: true,
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: '<%= config.app %>/',
                        src: ['assets/**'],
                        dest: '<%= config.buildPath %>/'
                    },
                    {
                        expand: true,
                        cwd: '<%= config.app %>/',
                        src: ['js/**'],
                        dest: '<%= config.buildPath %>/'
                    },
                    {
                        expand: true,
                        cwd: './',
                        src: ['bower_components/**'],
                        dest: '<%= config.buildPath %>/'
                    }
                ]
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.app %>/',
                        src: ['index.html'],
                        dest: '<%= config.distPath %>/',
                        flatten: true,
                        filter: 'isFile'
                    }
                ]
            }
        },


        // Add hash on file name to avoid caching
        filerev: {
            options: {
                algorithm: 'md5',
                length: 4
            },
            prod: {
                src: [
                    '<%= config.distPath %>/js/**/*.js',
                    '<%= config.distPath %>/css/**/*.css'
                ]
            }
        },


        // Prepare files to be compressed and uglified
        useminPrepare: {
            html: ['<%= config.app %>/index.html'],
            options: {
                dest: '<%= config.distPath %>/',
                flow: {
                    html: {
                        steps: {
                            js: ['concat'],
                            css: ['concat', 'cssmin']
                        },
                        post: {}
                    }
                }
            }
        },


        // Change file paths to concatenated and filereved ones
        usemin: {
            html: ['<%= config.distPath %>/index.html'],
            options: {
                dest: '<%= config.distPath %>/'
            }
        },

        // Uglify just concatenated app.js file
        uglify: {
            prod: {
                files: [{
                    expand: true,
                    cwd: '<%= config.distPath %>/js/',
                    src: 'app.js',
                    dest: '<%= config.distPath %>/js/'
                }, {
                    expand: true,
                    cwd: '<%= config.distPath %>/js/',
                    src: 'vendor.js',
                    dest: '<%= config.distPath %>/js/'
                }]
            }
        },

        // Minify HTML
        htmlmin: {
            deploy: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.productionPath %>/',
                    src: ['index.html'],
                    dest: '<%= config.productionPath %>/'
                }]
            }
        },

        // Connect application
        connect: {
            options: {
                port: 8001,
                livereload: 35730,
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '<%= config.buildPath %>/'
                    ]
                }
            }
        },


        // Watch and live reload code
        watch: {
            options: {
                livereload: {
                    host: 'localhost',
                    port: '<%= connect.options.livereload %>'
                },
                dateFormat: function (time) {
                    grunt.log.writeln('File changed changed in ' + time + ' ms at ' + (new Date()).toString());
                    grunt.log.writeln('Waiting for more changes...');
                }
            },
            gruntfile: {
                files: [
                    './Gruntfile.js'
                ]
            },
            html: {
                files: [
                    '<%= config.app %>/app/**/*.html',
                    '<%= config.app %>/components/**/*.html',
                    '<%= config.app %>/index.html'
                ],
                tasks: ['copy:build']
            },
            sass: {
                files: [
                    '<%= config.app %>/scss/**/*.scss'
                ],
                tasks: ['sass:build',
                    // 'postcss:build',
                    'copy:build']
            },
            js: {
                files: [
                    '<%= config.app %>/js/**/*.js'
                ],
                tasks: ['copy:build']
            }
        }
    });


    /************************************************************************
     * Registered Tasks
     ************************************************************************/

    grunt.registerTask('lint', [
        'jshint',
        'jscs',
        'scsslint'
    ]);


    grunt.registerTask('test', [
        'html2js:tests',
        'env:test',
        'karma'
    ]);


    grunt.registerTask('build', [
        'clean:build',
        // 'sprite:build',
        'sass:build',
        // 'postcss:build',
        'copy:build'
    ]);


    grunt.registerTask('production', [
        'clean:prod',
        'lint',
        'env:prod',
        'wiredep:prod',
        'html2js:prod',
        'sprite:prod',
        'copy:dist',
        'sass:prod',
        'postcss:prod',
        'useminPrepare',
        'concat:generated',
        'cssmin:generated',
        'ngAnnotate',
        'uglify',
        'filerev',
        'usemin',
        'copy:prod',
        'ngconstant:prod',
        'imagemin',
        'htmlmin',
        'clean:after'
    ]);


    grunt.registerTask('serve', [
        'build',
        'connect:livereload',
        'watch'
    ]);


    grunt.registerTask('server', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` next time.');
        grunt.task.run([target ? ('serve:' + target) : 'serve']);
    });
};
