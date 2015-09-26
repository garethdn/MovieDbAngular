(function(){
	'use strict';

	angular
		.module('app.movie')
		.directive('movieListItem', function(){
			return {
				restrict: 'E',
				templateUrl: 'movie/movieListItem.directive.html'
			};
		});
})();