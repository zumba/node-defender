/* globals define */
define(
	['jquery', 'underscore', 'ace'],
	function($, _, ace){
		return function(){
			_.each(['commander', 'roundinfo'], function(code) {
				var editor = ace.edit(code);
				editor.setReadOnly(true);
				editor.setTheme('ace/theme/monokai');
				editor.getSession().setMode('ace/mode/javascript');
			});
		};
	}
);