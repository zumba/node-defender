/* globals requirejs */
requirejs.config({
	baseUrl : '/js',
	paths : {
		jquery : '//http://code.jquery.com/jquery-1.10.2.min'
	},
	shim : {}
});

require('main');