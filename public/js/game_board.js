var GameBoard = (function() {
	var _round;
	var _previousRound;

	var _boardId = 'gameboard';
	var _boardStage;
	var _boardLayer;
	var _boardCenter;

	var _positions = [];
	var _enemies = [];

	var BOARD_SIZE = { w: 650, h: 550 },
		ENEMY_ICON_SIZE = 30,
		PROFILE_GRAVATAR_SIZE = 30,
		ATTACK_SPEED = 200, // ms
		MATH_DEG_TO_RAD = Math.PI / 180,
		ENEMY_HYPOTENUSE = Math.sqrt(2 * Math.pow(ENEMY_ICON_SIZE, 2)),
		ENEMY_HYPOTENUSE_HALF = ENEMY_HYPOTENUSE / 2,
		POSITION_OFFSET = Math.sqrt(2 * Math.pow(PROFILE_GRAVATAR_SIZE, 2)) / 2,
		POSITION_WIDTH = ENEMY_HYPOTENUSE + 2,
		POSITION_PADDING = (POSITION_WIDTH - ENEMY_ICON_SIZE) / 2,
		PLAYER_GRAVATAR_DEFAULT = 'http://c.dryicons.com/images/icon_sets/simplistica/png/32x32/user.png',
		ENEMY_ICONS = {
			grunt: 'http://www.southeastarrow.com/images/icons/blue-left-arrow.png',
			swarmer: 'http://www.southeastarrow.com/images/icons/blue-left-arrow.png',
			trooper: 'http://www.southeastarrow.com/images/icons/blue-left-arrow.png',
			'speed-demon': 'http://www.southeastarrow.com/images/icons/blue-left-arrow.png',
			flyer: 'http://www.southeastarrow.com/images/icons/blue-left-arrow.png',
			cluster: 'http://www.southeastarrow.com/images/icons/blue-left-arrow.png',
			bruiser: 'http://www.southeastarrow.com/images/icons/blue-left-arrow.png'
		};

	function Position(num, center) {
		this.num = num;
		this.center = center;
		this.spots = [];

		this.radius = POSITION_OFFSET + this.num * POSITION_WIDTH;
		this.enemyRadius = this.getRadius() + POSITION_PADDING;
		this.maxOfSpots = Math.floor((2 * Math.PI * (this.radius + POSITION_WIDTH / 2)) / (ENEMY_ICON_SIZE * 1.5));
		this.spotAngle = 2 * Math.PI / this.maxOfSpots;
		this.startAngle = Math.asin((ENEMY_ICON_SIZE / 2) / this.radius);

		this.renderMark();
	};

	Position.prototype.getMaxSpots = function() {
		return this.maxOfSpots;
	};

	Position.prototype.getFreeSpot = function() {
		for (var i = 0; i < this.getMaxSpots(); i++) {
			if (typeof this.spots[i] === 'undefined' || this.spots[i] === false) {
				return this.spots[i] = {
					id: i,
					position: this,
					enemyAngle: this.spotAngle * i - this.startAngle
				};
			}
		}
		return false;
	};

	Position.prototype.renderMark = function() {
		this.mark = new Kinetic.Circle({
			x: this.center.x,
			y: this.center.y,
			radius: this.radius,
			stroke: '#555',
			strokeWidth: 1,
			dashArray: [10, 10]
		});
		_boardLayer.add(this.mark);
	};

	Position.prototype.getRadius = function() {
		return this.radius;
	};

	Position.prototype.getEnemyRadius = function() {
		return this.enemyRadius;
	};

	Position.prototype.getInitialAngle = function() {
		return this.startAngle;
	};

	Position.prototype.setSpot = function(spot, enemy) {
		if (spot >= this.maxOfSpots) {
			return;
		}
		this.spots[spot] = enemy;
	};

	Position.prototype.reset = function() {
		this.spots = [];
	};

	function Enemy(mob) {
		this.mob = mob;
		this.spot = null;
		this.image = null;
	};

	Enemy.prototype.render = function() {
		var pos = _positions[this.mob.position];
		var posSpot = pos.getFreeSpot();
		if (posSpot === false) {
			// No spot available
			return;
		}
		pos.setSpot(posSpot.id, this);
		this.spot = posSpot;

		var enemy = this,
			imageObj = new Image();
		imageObj.onload = function() {
			var enemyRadius = pos.getEnemyRadius();
				posX = enemyRadius * Math.cos(posSpot.enemyAngle),
				posY = enemyRadius * Math.sin(posSpot.enemyAngle);

			enemy.image = new Kinetic.Image({
				x: _boardCenter.x + posX,
				y: _boardCenter.y + posY,
				image: imageObj,
				rotation: posSpot.enemyAngle,
				width: ENEMY_ICON_SIZE,
				height: ENEMY_ICON_SIZE
			});
			_boardLayer.add(enemy.image);
			_boardStage.add(_boardLayer);
		};
		imageObj.src = ENEMY_ICONS[this.mob.type];
	};

	Enemy.prototype.getRotation = function() {
		return this.image === null ? 0 : this.image.getRotation();
	};

	Enemy.prototype.getCenterPoint = function() {
		if (this.image === null) {
			return { x: 0, y: 0};
		}

		var a45 = Math.PI / 4; // 45 deg to rad
		return {
			x: this.image.getX() + (Math.cos(a45 + this.image.getRotation() - this.spot.position.getInitialAngle()) * ENEMY_HYPOTENUSE_HALF),
			y: this.image.getY() + (Math.sin(a45 + this.image.getRotation() - this.spot.position.getInitialAngle()) * ENEMY_HYPOTENUSE_HALF),
		};
	};

	Enemy.prototype.kill = function() {
		this.spot.position.setSpot(this.spot.id, false);
		this.image.remove();
	};

	var renderMobs = function(mobs) {
		_.each(mobs, function(mob) {
			if (typeof _enemies[mob.id] !== 'undefined') {
				// Do not render if the enemy is on the board
				return;
			}

			_enemies[mob.id] = new Enemy(mob);
			_enemies[mob.id].render();
		});
	};

	function GameBoard(roundInfo) {
		_previousRound = _round;
		_round = roundInfo;
		renderMobs(_round.getMobs());
	}

	GameBoard.prototype.displayAttack = function() {
		_.each(_round.getMyAttacks(), function(attack) {
			var enemyId = attack.enemyId,
				enemy = _enemies[enemyId],
				isEnemyDead = !_.find(_round.getMobs(), function(mob) { return mob.id === enemyId; });

			var attackLine = new Kinetic.Line({
				x: _boardCenter.x,
				y: _boardCenter.y,
				points: [0, 0, 10, 0],
				stroke: 'red',
				rotation: enemy.getRotation()
			});
			_boardLayer.add(attackLine);

			var enemyCenter = enemy.getCenterPoint();
			var diffX = enemyCenter.x - attackLine.getX(),
				diffY = enemyCenter.y - attackLine.getY();
			var anim = new Kinetic.Animation(function(frame) {
				if (frame.time >= ATTACK_SPEED) {
					this.stop();
					attackLine.remove();

					if (isEnemyDead) {
						enemy.kill();
						delete _enemies[enemyId];
					}
					return;
				}
				var rate = frame.time / ATTACK_SPEED;
				attackLine.setX(_boardCenter.x + diffX * rate);
				attackLine.setY(_boardCenter.y + diffY * rate);
			}, _boardLayer);
			anim.start();
		});
	};

	GameBoard.prototype.displayEnemyAttack = function() {
	};

	GameBoard.renderUser = function() {
		var imageObj = new Image();
		imageObj.onload = function() {
			var gravatar = new Kinetic.Image({
				x: _boardCenter.x - (PROFILE_GRAVATAR_SIZE / 2),
				y: _boardCenter.y - (PROFILE_GRAVATAR_SIZE / 2),
				image: imageObj,
				width: PROFILE_GRAVATAR_SIZE,
				height: PROFILE_GRAVATAR_SIZE
			});
			_boardLayer.add(gravatar);
			_boardStage.add(_boardLayer);
		};
		imageObj.src = (typeof twitter !== 'undefined' && twitter.profile_image_url_https) || PLAYER_GRAVATAR_DEFAULT;
	};

	GameBoard.renderPositionMarks = function() {
		_.each([0, 1, 2, 3, 4, 5], function(pos) {
			_positions[pos] = new Position(pos, _boardCenter);
		});
	};

	GameBoard.renderTemplate = function() {
		GameBoard.renderUser();
		GameBoard.renderPositionMarks();
	};

	GameBoard.boardSetup = function() {
		_boardStage = new Kinetic.Stage({
			container: _boardId,
			width: BOARD_SIZE.w,
			height: BOARD_SIZE.h
		});
		_boardCenter = {
			x: _boardStage.getWidth() / 2,
			y: _boardStage.getHeight() / 2
		};
		_boardLayer = new Kinetic.Layer();

		GameBoard.renderTemplate();
	};

	GameBoard.cleanup = function() {
		_.each(_enemies, function(enemy) {
			enemy.kill();
		});
		_enemies = [];

		_.each(_positions, function(position) {
			position.reset();
		});
	};

	return GameBoard;

}());