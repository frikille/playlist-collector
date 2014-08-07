/* global module: false, process: false */
module.exports = function (grunt) {
	var isProd = (grunt.option('production') !== undefined) ? Boolean(grunt.option('production')) : process.env.GRUNT_ISPROD === '1';

	if (!isProd) {
		grunt.log.subhead('Running Grunt in DEV mode');
	}

	grunt.initConfig({
		blanket: {
			coverage: {
				src: ['src/'],
				dest: 'coverage/src/'
			}
		},
		clean: {
			coverage: {
				src: ['coverage/']
			}
		},
		copy: {
			coverage: {
				src: ['test/**'],
				dest: 'coverage/'
			}
		},
		jshint: {
			js: {
				options: {
					'bitwise': true,
					'curly': true,
					'eqeqeq': true,
					'es3': true,
					'immed': true,
					'latedef': true,
					'newcap': true,
					'noarg': true,
					'noempty': true,
					'nonew': true,
					'quotmark': 'single',
					'unused': true,
					'undef': true,
					'trailing': true,
					'laxbreak': true,
					'maxerr': 100,
					'browser': true,
					'jquery': true,
					'globals': {
						'require': false,
						'define': false,
						's': false,
						'Swipe': false
					},
					reporter: require('jshint-stylish')
				},
				files: {
					src: [
						'Gruntfile.js',
						'src/**/*.js',
						'!node_modules/**/*'
					]
				}
			}
		},
		mochaTest: {
			test: {
				options: {
					reporter: 'spec',
					require: [
						'coverage/src/web.js'
					]
				},
				src: ['coverage/test/**/*.js']
			},
			coverage: {
				options: {
					reporter: 'html-cov',
					quiet: true,
					captureFile: 'reports/coverage.html'
				},
				src: ['coverage/test/**/*.js']
			},
			'travis-cov': {
				options: {
					reporter: 'travis-cov'
				},
				src: ['coverage/test/**/*.js']
			}
		}
	});

	grunt.loadNpmTasks('grunt-blanket');         // Instruments files for coverage
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');  // Checks if javascript codes are nice or not
	grunt.loadNpmTasks('grunt-mocha-test');	     // Runs mocha tests

	grunt.registerTask('default', [
		'verify'
	]);

	grunt.registerTask('verify', [
		'jshint',
		'test:js'
	]);

	grunt.registerTask('test:js', ['clean', 'blanket', 'copy', 'mochaTest']);
};
