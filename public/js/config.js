/* globals requirejs */
requirejs.config({
	baseUrl : '/js',
	paths : {
		// lib
		blabber : 'lib/blabber',
		brain : 'lib/brain',
		client : 'lib/client',
		commander : 'lib/commander',
		gameboard : 'lib/game_board',
		roundInfo : 'lib/round_info',

		// vendor
		ace : 'vendor/ace/ace',
		bootstrap : '//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min',
		howler : 'vendor/howler.min',
		jquery : '//code.jquery.com/jquery-1.10.2.min',
		socketio : window.host + '/socket.io/socket.io',

		sprintf : 'vendor/sprintf.min',
		underscore : '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min',
		kinetic : '//d3lp1msu2r81bx.cloudfront.net/kjs/js/lib/kinetic-v4.7.2.min'
	},
	shim : {
		ace : { exports : 'ace' },
		bootstrap : ['jquery'],
		howler : { exports : 'Howl' },
		kinetic : { exports : 'Kinetic' },
		main : ['bootstrap'],
		socketio : { exports : 'io' },
		sprintf : { exports : 'sprintf' },
		underscore : { exports : '_' }
	}
});

require(['main']);