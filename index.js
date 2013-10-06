/* globals process */

// Modules
var io = require('socket.io-client');
var _ = require('underscore');
var tracer = require('tracer').colorConsole({
	level: 'debug',
    format : "{{message}}",
});

// Lib
var RoundInfo = require('./lib/round_info');
var Brain = require('./lib/brain');
var Commander = require('./lib/commander');

// locals
var defender = io.connect((process.env.HOST || 'http://localhost:1337') + '/defender', {
	query: 'username=' + Brain.username
});
var brain = new Brain(new Commander(defender, tracer));

defender
	.on('handshake', function(data) {
		tracer.info('%s', data.message);
	})
	.on('round', function(data) {
		tracer.info('Round %s', data.round);
		// @todo remove debug output
		tracer.debug(data);

		brain.onRound(new RoundInfo(data));
	})
	.on('death', function(data) {
		tracer.error('%s', data.message);
		tracer.warn(data.stats);
	})
	.on('disconnect', function() {
		tracer.info('Disconnected: Thanks for playing.');
		process.exit();
	});
