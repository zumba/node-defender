/* globals define */
define(['jquery'], function($){
	return function(){
		$('.main').on('submit', '.register-form', function(e) {
			var input = $(e.currentTarget).find('input');
			if (!/^[\w\-\(\) ]+$/.test(input.val())) {
				e.preventDefault();
				e.stopPropagation();
				input
					.tooltip({
						'title': 'Invalid username.',
						'trigger': 'manual'
					})
					.tooltip('show');
			}
		});
	};
});