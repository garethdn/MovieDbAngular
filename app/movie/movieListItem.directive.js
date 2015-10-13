(function(){
	'use strict';

	angular
		.module('app.movie')
		.directive('movieListItem', movieListItem);

  movieListItem.$inject = ['API_SETTINGS'];

  function movieListItem(API_SETTINGS) {
    var directive = {
      restrict: 'E',
      templateUrl: 'movie/movieListItem.directive.html',
      link: link,
      replace: true
    };

    return directive;

    function link(scope) {
      scope.API_SETTINGS = API_SETTINGS;
    }
  }

})();