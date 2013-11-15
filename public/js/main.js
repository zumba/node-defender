require(['jquery'], function($){
	$(function(){
		var view = $('body').data('view');
		var availableModules = [
			'index', 'howto', 'game'
		];
		if (availableModules.indexOf(view) < 0) {
			return;
		}
		require([view], function (module) {
			module();
		});
	});
});
