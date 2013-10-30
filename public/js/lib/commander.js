/* globals _ */
var Commander = (function() {

	var _defender;
	var _defaultAttackMode = 'power';
	var _validAttackModes = [
		'power',
		'rapid',
		'ranged',
		'collateral',
		'defensive'
	];
	var _consumedTokenCache = [];

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
		if (_.contains(_consumedTokenCache, this.roundToken)) {
			return;
		}
		_defender.emit('action', {
			target: this.enemyTarget,
			attack_mode: this.mode,
			roundToken: this.roundToken
		});
		_consumedTokenCache.push(this.roundToken);
	};

	return Commander;

}());
