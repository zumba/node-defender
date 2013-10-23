var GameBoard = (function() {
	var _round;
	var _previousRound;

	var _boardId = 'gameboard';
	var _boardStage;
	var _boardLayer;

	var _enemies = [];

	var POSITION_OFFSET = 70,
		POSITION_WIDTH = 50,
		ENEMY_ICON_SIZE = 30,
		ENEMY_ICONS = {
			grunt: 'http://images3.wikia.nocookie.net/__cb20130111055640/reignofdragons/images/2/28/Symbol.Melee.30.png',
			swarmer: 'http://images3.wikia.nocookie.net/__cb20130111055640/reignofdragons/images/2/28/Symbol.Melee.30.png',
			trooper: 'http://images3.wikia.nocookie.net/__cb20130111055640/reignofdragons/images/2/28/Symbol.Melee.30.png',
			'speed-demon': 'http://images3.wikia.nocookie.net/__cb20130111055640/reignofdragons/images/2/28/Symbol.Melee.30.png',
			flyer: 'http://images3.wikia.nocookie.net/__cb20130111055640/reignofdragons/images/2/28/Symbol.Melee.30.png',
			cluster: 'http://images3.wikia.nocookie.net/__cb20130111055640/reignofdragons/images/2/28/Symbol.Melee.30.png',
			bruiser: 'http://images3.wikia.nocookie.net/__cb20130111055640/reignofdragons/images/2/28/Symbol.Melee.30.png'
		};

	var renderMobs = function(mobs) {
		_.each(mobs, function(mob) {
			if (typeof _enemies[mob.id] !== 'undefined') {
				return;
			}

			var posX = POSITION_OFFSET + mob.position * POSITION_WIDTH + (POSITION_WIDTH - ENEMY_ICON_SIZE) / 2;
			var posY = ENEMY_ICON_SIZE / 2;
			var imageObj = new Image();
			imageObj.onload = function() {
				_enemies[mob.id] = new Kinetic.Image({
					x: (_boardStage.getWidth() / 2) + posX,
					y: (_boardStage.getHeight() / 2) - posY,
					image: imageObj,
					width: ENEMY_ICON_SIZE,
					height: ENEMY_ICON_SIZE
				});
				_boardLayer.add(_enemies[mob.id]);
				_boardStage.add(_boardLayer);
			};
			imageObj.src = ENEMY_ICONS[mob.type];
		});
	};

	function GameBoard(roundInfo) {
		_previousRound = _round;
		_round = roundInfo;
		renderMobs(_round.getMobs());
	}

	GameBoard.prototype.displayAttack = function() {
	};

	GameBoard.prototype.displayEnemyAttack = function() {
	};

	GameBoard.renderUser = function() {
		var imageObj = new Image();
		imageObj.onload = function() {
			var imgDimension = 73;
			var gravatar = new Kinetic.Image({
				x: (_boardStage.getWidth() / 2) - (imgDimension / 2),
				y: (_boardStage.getHeight() / 2) - (imgDimension / 2),
				image: imageObj,
				width: imgDimension,
				height: imgDimension
			});
			_boardLayer.add(gravatar);
			_boardStage.add(_boardLayer);
		};
		imageObj.src = 'https://pbs.twimg.com/profile_images/2614463797/6tubelo97kiphf2jmehx_bigger.jpeg';
	};

	GameBoard.renderPositionMarks = function() {
		_.each([0, 1, 2, 3, 4, 5], function(pos) {
			_boardLayer.add(new Kinetic.Circle({
				x: _boardStage.getWidth() / 2,
				y: _boardStage.getHeight() / 2,
				radius: pos * POSITION_WIDTH + POSITION_OFFSET,
				stroke: 'black',
				strokeWidth: 4
			}));
		});
	};

	GameBoard.renderTemplate = function() {
		GameBoard.renderUser();
		GameBoard.renderPositionMarks();
	};

	GameBoard.boardSetup = function() {
		_boardStage = new Kinetic.Stage({
			container: _boardId,
			width: 800,
			height: 500
		});
		_boardLayer = new Kinetic.Layer();

		GameBoard.renderTemplate();
	};

	return GameBoard;

}());