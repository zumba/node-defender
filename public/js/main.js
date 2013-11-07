require(['jquery', 'index', 'game', 'howto'], function($, index, game, howto){
	$(function(){
		var view = $('body').data('view');
		var views = { index : index, game : game, howto : howto };

		if (views[view]){
				views[view]();
		}
	});
});