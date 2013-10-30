/* globals requirejs */
requirejs.config({
	baseUrl : '/js',
	paths : {
		// lib
		blabber : 'lib/blabber',
		brain : 'lib/brain',
		client : 'lib/client',
		commander : 'lib/commander',
		gameBoard : 'lib/game_board',
		roundInfo : 'lib/round_info',

		// vendor
		bootstrap : '//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min',
		jquery : '//code.jquery.com/jquery-1.10.2.min',
		underscore : '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min'
	},
	shim : {
		bootstrap : ['jquery'],
		main : ['bootstrap'],
		underscore : { exports : '_' }
	}
});

require(['main']);