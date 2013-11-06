/* globals ga, confirm, define */
define(
	['jquery', 'ace', 'brain', 'gameboard', 'client'],
	function($, ace, Brain, GameBoard, Client){
		return function(){
			var editor = ace.edit("editor");
			var startedGames = 0;
			editor.setTheme("ace/theme/monokai");
			editor.getSession().setMode("ace/mode/javascript");
			editor.getSession().setValue(Brain.retrieveStrategy());
			$('#toggle-game-board').on('click', function(e) {
				e.preventDefault();
				$('#editor-panel').parent().addClass('hidden');
				$('#game-board-panel').parent().removeClass('hidden');
			});
			$('#toggle-editor').on('click', function(e) {
				e.preventDefault();
				$('#game-board-panel').parent().addClass('hidden');
				$('#editor-panel').parent().removeClass('hidden');
			});
			$('#toggle-sound').on('click', function(e) {
				var $this = $(this);

				e.preventDefault();
				if ($this.data('status') === 'muted') {
					GameBoard.mute = false;
					$this.data('status', 'unmuted');
					$this.html('<i class="icon-volume-up" style="font-size: 1.4em"/>');
				} else {
					GameBoard.mute = true;
					$this.data('status', 'muted');
					$this.html('<i class="icon-volume-off" style="font-size: 1.4em"/>');
				}
			});
			$('#start').on('click', function(e) {
				if (typeof ga === 'function') {
					ga('send', 'event', 'game', 'start', 'Start Game', ++startedGames);
				}
				$('#editor-panel').parent().addClass('hidden');
				$('#game-board-panel').parent().removeClass('hidden');
				e.preventDefault();
				Client.start(
					window.username,
					editor.getSession().getValue(),
					{
						token: window.token,
						secret: window.secret
					}
				);
			});
			$('#reset').on('click', function(e) {
				e.preventDefault();
				if (!confirm('Are you sure you want to reset your strategy?')) {
					return;
				}
				editor.getSession().setValue(Brain.getBaseStrategy());
			});
			GameBoard.boardSetup();
			// Assign a global error handler from the client
			window.onerror = Client.onerror;
		};
	}
);