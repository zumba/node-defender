var strategy = require(__dirname + '/../strategy');

module.exports = (function() {

	function Brain(commander) {
		this.commander = commander;
	}

	Brain.prototype.onRound = function(roundInfo) {
		this.commander.target(_.first(roundInfo.getMobs()).id);
		strategy.onRound(roundInfo, this.commander);
		this.commander.sendToServer();
	};

	return Brain;

}());
