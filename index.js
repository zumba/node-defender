var io = require('socket.io-client');
var tracer = require('tracer').colorConsole({
	level: 'debug',
    format : "{{message}}",
});

var defender = io.connect('http://localhost:1337/defender', {
	query: 'username=player1'
});

defender
	.on('handshake', function(data) {
		tracer.info('%s', data.message);
	})
	.on('round', function(data) {
		tracer.info('Round %s', data.round);
		tracer.debug(data);
		defender.emit('action', {
			'target': 'somemobid',
			'weapon': 'someweapontouse'
		});
	})
	.on('death', function(data) {
		tracer.error('%s', data.message);
		tracer.warn(data.stats);
	})
	.on('disconnect', function(data) {
		tracer.info('Disconnected: Thanks for playing.');
		process.exit();
	});
