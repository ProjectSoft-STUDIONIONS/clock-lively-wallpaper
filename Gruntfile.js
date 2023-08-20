module.exports = function(grunt) {
	var fs = require('fs'),
		chalk = require('chalk'),
		uniqid = function () {
			var md5 = require('md5');
			result = md5((new Date()).getTime()).toString();
			grunt.verbose.writeln("Generate hash: " + chalk.cyan(result) + " >>> OK");
			return result;
		};
	
	String.prototype.hashCode = function() {
		var hash = 0, i, chr;
		if (this.length === 0) return hash;
		for (i = 0; i < this.length; i++) {
			chr   = this.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0;
		}
		return hash;
	};
	
	var gc = {
		default: [
			"clean",
			"uglify",
			"imagemin",
			"less",
			"cssmin",
			"copy",
			"pug",
			"file-creator",
			"compress",
		]
	},
	NpmImportPlugin = require("less-plugin-npm-import");
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);
	grunt.initConfig({
		globalConfig : gc,
		pkg : grunt.file.readJSON('package.json'),
		clean: {
			options: {
				force: true
			},
			all: [
				'test/',
				'tests/',
				'dest/'
			],
			zip: [
				'clock-lively-wallpaper.zip'
			]
		},
		uglify: {
			options: {
				sourceMap: false,
				compress: {
					drop_console: false
	  			}
			},
			app: {
				files: [
					{
						expand: true,
						flatten : true,
						src: [
							'src/js/main.js'
						],
						dest: 'dest/js',
						filter: 'isFile',
					}
				]
			}
		},
		less: {
			css: {
				options : {
					compress: false,
					ieCompat: false,
					plugins: [
						new NpmImportPlugin({prefix: '~'})
					],
					modifyVars: {}
				},
				files : {
					'test/css/style.css' : [
						'src/css/style.less'
					]
				}
			},
		},
		cssmin: {
			options: {
				mergeIntoShorthands: false,
				roundingPrecision: -1
			},
			minify: {
				files: {
					'dest/css/style.css' : ['test/css/style.css'],
				}
			},
		},
		imagemin: {
			options: {
				optimizationLevel: 3,
				svgoPlugins: [
					{
						removeViewBox: false
					}
				]
			},
			base: {
				files: [
					{
						expand: true,
						cwd: 'src/wallpapers', 
						src: ['**/*.jpg'],
						dest: 'dest/wallpapers/',
					}
				]
			}
		},
		copy: {
			resource: {
				files: [
					{
						expand: true,
						cwd: 'src/fonts',
						src: [
							'*.ttf'
						],
						dest: 'dest/fonts/',
					},
					/*{
						expand: true,
						cwd: 'src/videos',
						src: [
							'*.webm'
						],
						dest: 'dest/videos/',
					},*/
					{
						expand: true,
						cwd: 'src',
						src: [
							'*.json',
							'*.jpg',
							'*.gif'
						],
						dest: 'dest/',
					},
					{
						expand: true,
						cwd: '',
						src: [
							'LICENSE'
						],
						dest: 'dest/',
					}
				],
			},
		},
		pug: {
			serv: {
				options: {
					doctype: 'html',
					client: false,
					//pretty: '\t',
					//separator:  '\n',
					pretty: '',
					separator:  '',
					data: function(dest, src) {
						return {
							"hash": uniqid()
						}
					}
				},
				files: [
					{
						expand: true,
						cwd: __dirname + '/src/',
						src: [ '*.pug' ],
						dest: __dirname + '/dest/',
						ext: '.html'
					}
				]
			},
		},
		compress: {
			main: {
				options: {
					mode: 'zip',
      				archive: 'clock-lively-wallpaper.zip'
				},
				expand: true,
				cwd: 'dest/',
				src: ['**/*'],
				dest: '/'
			}
		},
		"file-creator": {
			basic: {
				'dest/.gitignore': function(fs, fd, done) {
					fs.writeSync(fd, '*.*\r**/*\r');
					done();
				}
			}
		}
	});
	grunt.registerTask('default',	gc.default);
};
