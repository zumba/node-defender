var RoundInfo = (function() {

	function RoundInfo(serverData) {
		this._serverData = serverData;
	}

	RoundInfo.prototype.getEnemyActions = function() {
		return this._serverData.enemyActions;
	};

	RoundInfo.prototype.getEnemyTypeById = function(id) {
		var enemy = _.find(this.getMobs(), function(mob) {
			return mob.id === id;
		});
		if (enemy) {
			return enemy.type;
		}
		return '';
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

	RoundInfo.prototype.getRoundToken = function() {
		return this._serverData.roundToken;
	};

	RoundInfo.prototype.getSummary = function() {
		return this._serverData.summary;
	};

	RoundInfo.prototype.playerName = function() {
		return this._serverData.player.name;
	};

	RoundInfo.prototype.playerHealth = function() {
		return this._serverData.player.health;
	};

	RoundInfo.prototype.debug = function() {
		return this._serverData;
	};

	return RoundInfo;

}());
