/* globals process */

// Modules
var io = require('socket.io-client');
var _ = require('underscore');

// Lib
var RoundInfo = require('./lib/round_info');
var Brain = require('./lib/brain');
var Commander = require('./lib/commander');
var Blabber = require('./lib/blabber');

// locals
var defender = io.connect((process.env.HOST || 'http://localhost:8080') + '/defender', {
	query: 'username=' + require('./strategy').name
});
var brain = new Brain(new Commander(defender));
var blab;

defender
	.on('handshake', function(data) {
		Blabber.info(data.message);
	})
	.on('round', function(data) {
		Blabber.info('\nRound %s\n', data.round);
		blab = new Blabber(data);
		blab.displayPlayerHealth();
		blab.displayPlayerActions();
		blab.displayEnemyActions();

		brain.onRound(new RoundInfo(data));
	})
	.on('death', function(data) {
		Blabber.error('\n%s', data.message);
		Blabber.warn(data.stats);
	})
	.on('disconnect', function() {
		Blabber.info('Disconnected: Thanks for playing.');
		process.exit();
	})
	.on('connect_failed', function(reason) {
		Blabber.error(reason);
		process.exit();
	});
