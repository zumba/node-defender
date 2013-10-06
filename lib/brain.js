var _ = require('underscore');
/**
 * This is where you control your strategy and communicate with the server
 * about the actions you want to take.
 *
 * Below is a sample "strategy" to make you familiar with the available API.
 */

module.exports = (function() {

	function alpha(mobs) {
		// Attack the first mob
		var enemy = _.first(mobs);
		return enemy.id;
	}

	function Brain(commander) {
		this.commander = commander;
	};

	Brain.username = 'player1';

	/**
	 * Recieves round info instance from the server with all information to make
	 * an informed decision.
	 *
	 * @param RoundInfo roundInfo
	 * @return void
	 */
	Brain.prototype.onRound = function(roundInfo) {
		var target;
		this.commander.target(alpha(roundInfo.getMobs()));
		this.commander.attackMode('default');
		this.commander.sendToServer();
	}

	return Brain;

}());
