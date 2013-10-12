var Blabber = require('./blabber');
module.exports = (function() {

	var _defender, _tracer;

	function Commander(defender) {
		_defender = defender;
	}

	Commander.prototype.target = function(enemyId) {
		/**
		 * @todo code server to return an emeny (or enemies) death.
		 * @todo Listen to emeny deaths in this class and remove the target if it is dead.
		 */
		this.enemyTarget = enemyId;
	}

	Commander.prototype.attackMode = function(mode) {
		this.mode = mode;
	}

	Commander.prototype.sendToServer = function() {
		// @todo check for a target or no (healing?)
		// @todo check for a valid mode
		Blabber.debug('Targeting %s with %s attack mode.', this.enemyTarget, this.mode);
		_defender.emit('action', {
			'target': this.enemyTarget,
			'weapon': this.mode
		});
	}

	return Commander;

}());
