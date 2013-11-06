require(['jquery', 'index', 'game'], function($, index, game){
	$(function(){
		var view = $('body').data('view');
		var views = { index : index, game : game };

		if (views[view]){
				views[view]();
		}
	});
});