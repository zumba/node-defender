/* globals process */
var io = require('socket.io-client');
var _ = require('underscore');
var tracer = require('tracer').colorConsole({
	level: 'debug',
    format : "{{message}}",
});

var defender = io.connect('http://localhost:1337/defender', {
	query: 'username=player1'
});

function alpha(data) {
	// Attack the first mob
	var enemy = _.first(data.mobs);
	return enemy.id;
}

defender
	.on('handshake', function(data) {
		tracer.info('%s', data.message);
	})
	.on('round', function(data) {
		var target;
		tracer.info('Round %s', data.round);
		tracer.debug(data);

		target = alpha(data);
		tracer.debug('Target: ' + target);

		defender.emit('action', {
			'target': target,
			'weapon': 'default'
		});
	})
	.on('death', function(data) {
		tracer.error('%s', data.message);
		tracer.warn(data.stats);
	})
	.on('disconnect', function() {
		tracer.info('Disconnected: Thanks for playing.');
		process.exit();
	});
