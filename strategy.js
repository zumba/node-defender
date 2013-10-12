var _ = require('underscore');
/**
 * This is where you control your strategy and communicate with the server
 * about the actions you want to take.
 *
 * Below is a sample "strategy" to make you familiar with the available API.
 */

module.exports = {

	/**
	 * Define your player name.
	 *
	 * @type string
	 */
	name: 'player1',

	/**
	 * For each round of the game, the server will call this method and wait for
	 * your command. 
	 * 
	 * You will recieve a round info instance from the server with 
	 * all information to make an informed decision.
	 * You will also recieve a commander in order send your command to the server.
	 *
	 * @param RoundInfo roundInfo
	 * @param Commander commander
	 * @return void
	 */
	onRound: function(roundInfo, commander) {
		var enemy, attackModes;

		// Find the first enemy and target it.
		enemy = _.first(roundInfo.getMobs());

		// Target the enemy
		commander.target(enemy.id);

		// Select the attack mode
		commander.attackMode('power');
	}

};
