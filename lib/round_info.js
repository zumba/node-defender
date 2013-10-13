module.exports = (function() {

	var _serverData;

	function RoundInfo(serverData) {
		_serverData = serverData;
	}

	RoundInfo.prototype.getEnemyActions = function() {
		return _serverData.enemyActions;
	};

	RoundInfo.prototype.getMobs = function() {
		return _serverData.mobs;
	};

	RoundInfo.prototype.getMyAttacks = function() {
		return _serverData.attacks;
	};

	RoundInfo.prototype.getPlayerInfo = function() {
		return _serverData.player;
	};

	RoundInfo.prototype.getRound = function() {
		return _serverData.round;
	};

	RoundInfo.prototype.getSummary = function() {
		return _serverData.summary;
	};

	return RoundInfo;

}());
