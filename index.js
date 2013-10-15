/* globals process */

// Modules
var io = require('socket.io-client');
var _ = require('underscore');

// Lib
var RoundInfo = require('./lib/round_info');
var Brain = require('./lib/brain');
var Commander = require('./lib/commander');
var Blabber = require('./lib/blabber');
var Security = require('./lib/security');

// locals
var defender = io.connect((process.env.HOST || 'http://localhost:8080') + '/defender', {
	query: 'username=' + require('./strategy').name + '&clientHash=' + Security.generateFileHash()
});
var commander = new Commander(defender);
var brain = new Brain(commander);
var blab;

defender
	.on('handshake', function(data) {
		Blabber.info(data.message);
	})
	.on('round', function(data) {
		var roundInfo = new RoundInfo(data);
		Blabber.info('\nRound %s', data.round);

		blab = new Blabber(roundInfo);
		blab.displayPlayerHealth();
		if (data.insult){
			Blabber.error(data.insult);
		}
		if (data.round !== 1){
			Blabber.debug('\nTargeting %s with %s attack mode.', commander.enemyTarget, commander.mode);
			blab.displayPlayerActions();
			blab.displayEnemyActions();
		}

		brain.onRound(roundInfo);
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
