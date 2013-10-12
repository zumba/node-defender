var strategy = require(__dirname + '/../strategy');

module.exports = (function() {

	function Brain(commander) {
		this.commander = commander;
	};

	Brain.username = 'player1';

	Brain.prototype.onRound = function(roundInfo) {
		strategy.onRound(roundInfo, this.commander);
		this.commander.sendToServer();
	}

	return Brain;

}());
