/* globals ga, confirm, define */
define(
	['jquery', 'ace', 'brain', 'gameboard', 'client'],
	function($, ace, Brain, GameBoard, Client){
		return function(){
			var editor = ace.edit("editor");
			var startedGames = 0;
			var editorParent = $('#editor-panel').parent();
			var gameBoardParent = $('#game-board-panel').parent();

			editor.setTheme("ace/theme/monokai");
			editor.getSession().setMode("ace/mode/javascript");
			editor.getSession().setValue(Brain.retrieveStrategy());

			$(document)
				.on('click', '#toggle-game-board', function(e){
					e.preventDefault();
					editorParent.addClass('hidden');
					gameBoardParent.removeClass('hidden');
				})
				.on('click', '#toggle-editor', function(e){
					e.preventDefault();
					gameBoardParent.addClass('hidden');
					editorParent.removeClass('hidden');
				})
				.on('click', '#toggle-sound', function(e){
					var button = $(e.currentTarget);
					var muted = button.data('status') === 'muted';

					e.preventDefault();
					GameBoard.mute = !muted; // toggle mute
					button
						.children('i')
						.removeClass()
						.addClass(muted ? 'icon-volume-up' : 'icon-volume-off')
						.end()
						.data('status', muted ? 'unmuted' : 'muted');
				})
				.on('click', '#start', function(e) {
					e.preventDefault();

					if (typeof ga === 'function') {
						ga('send', 'event', 'game', 'start', 'Start Game', ++startedGames);
					}

					editorParent.addClass('hidden');
					gameBoardParent.removeClass('hidden');
					Client.start(
						window.username,
						editor.getSession().getValue(),
						{
							token: window.token,
							secret: window.secret
						}
					);
				})
				.on('click', '#reset', function(e) {
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