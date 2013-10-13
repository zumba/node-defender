var _ = require('underscore');

module.exports = (function() {

	function RoundInfo(serverData) {
		this._serverData = serverData;
	}

	RoundInfo.prototype.getEnemyActions = function() {
		return this._serverData.enemyActions;
	};

	RoundInfo.prototype.getMobs = function() {
		return this._serverData.mobs;
	};

	RoundInfo.prototype.getMyAttacks = function() {
		return this._serverData.attacks;
	};

	RoundInfo.prototype.getPlayerInfo = function() {
		return this._serverData.player;
	};

	RoundInfo.prototype.getRound = function() {
		return this._serverData.round;
	};

	RoundInfo.prototype.getSummary = function() {
		return this._serverData.summary;
	};

	return RoundInfo;

}());
