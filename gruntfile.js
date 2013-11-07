/*global module:false*/
module.exports = function(grunt) {
	"use strict";
	var pkg, name, testServer, http, url, file;

	testServer = {};
	http = require('http');
	url = require('url');
	file = grunt.file;

	pkg = file.readJSON('package.json');
	name = pkg.name;
	grunt.initConfig({
		jshint: {
			options : {
				jshintrc : "jshint.json"
			},
			source : ['public/js/*.js', 'index.js']
		},
		compass: {
			dist: {
				options: {
					sassDir: 'sass',
					cssDir: 'public/css',
					environment: 'production'
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-compass');

	// Default task.
	grunt.registerTask('default', ['jshint']);
};
