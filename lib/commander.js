var _ = require('underscore');
var Blabber = require('./blabber');
module.exports = (function() {

	var _defender, _tracer;
	var _defaultAttackMode = 'power';
	var _validAttackModes = [
		'power',
		'rapid',
		'ranged',
		'collateral',
		'defensive'
	];

	function Commander(defender) {
		_defender = defender;
	}

	Commander.availableAttackModes = function() {
		// Return a "cloned" array as to not allow the user to modify.
		return _validAttackModes.slice(0);
	};

	Commander.prototype.attackMode = function(mode) {
		if (!_.contains(_validAttackModes, mode)) {
			mode = _defaultAttackMode;
		}
		this.mode = mode;
	};

	Commander.prototype.availableAttackModes = function() {
		return Commander.availableAttackModes();
	};

	Commander.prototype.target = function(enemyId) {
		/**
		 * @todo code server to return an emeny (or enemies) death.
		 * @todo Listen to emeny deaths in this class and remove the target if it is dead.
		 */
		this.enemyTarget = enemyId;
	};

	Commander.prototype.sendToServer = function() {
		// @todo check for a target or no (healing?)
		Blabber.debug('Targeting %s with %s attack mode.', this.enemyTarget, this.mode);
		_defender.emit('action', {
			'target': this.enemyTarget,
			'attack_mode': this.mode
		});
	};

	return Commander;

}());
