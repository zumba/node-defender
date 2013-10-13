var _ = require('underscore');
var tracer = require('tracer').colorConsole({
	level: 'debug',
    format : "{{message}}",
});

module.exports = (function() {

	var damageTemplates = {
		weak: [
			'%s barely scratches %s.',
			'%s mostly wiffed %s.',
			'%s broke the skin of %s.'
		],
		normal: [
			'%s damages %s.',
			'%s hits %s.',
			'%s strikes %s.'
		],
		strong: [
			'%s pulverizes %s',
			'%s knocked %s back to last thursday.',
			'%s put a boot up %s\'s butt.'
		]
	};

	var getWeightedDamageSentence = function(attack) {
		var strength = attack.damage >= 10 ? 'strong' :
			attack.damage > 5 && attack.damage < 10 ? 'normal' :
			'weak';
		return getRandomDamageSentence(strength);
	};

	var getRandomDamageSentence = function(type) {
		return damageTemplates[type][Math.floor(Math.random() * damageTemplates[type].length)];
	};

	function Blabber(serverOutput) {
		this.serverOutput = serverOutput;
	}

	Blabber.prototype.displayPlayerActions = function() {
		_.each(this.serverOutput.attacks, _.bind(function(attack) {
			var string = getWeightedDamageSentence(attack) + ' (%s damage)';
			Blabber.debug(string, this.serverOutput.player.name, attack.enemyId, attack.damage);
		}, this));
	};

	Blabber.prototype.displayEnemyActions = function() {
		_.each(this.serverOutput.enemyActions, _.bind(function(action) {
			var string = getWeightedDamageSentence(action) + ' (%s damage)';
			Blabber.warn(string, action.id, this.serverOutput.player.name, action.damage);
		}, this));
	};

	Blabber.prototype.displayPlayerHealth = function() {
		var displayMode,
			playerHealth = this.serverOutput.player.health;
		if (playerHealth >= 700) {
			displayMode = 'info';
		} else if (playerHealth > 300 && playerHealth < 700) {
			displayMode = 'warn';
		} else {
			displayMode = 'error';
		}
		if (typeof Blabber[displayMode] === 'function') {
			Blabber[displayMode]('Player health: %s', playerHealth);
		}
	};

	Blabber.prototype.debugOutput = function() {
		Blabber.debug(this.serverOutput);
	};

	return _.extend(Blabber, tracer);

}());
