(function(){
	'use strict';

	angular
		.module('app.header')
		.controller('AppHeaderController', AppHeaderController);

	AppHeaderController.$inject = ['MOVIE_GENRES'];

	function AppHeaderController(MOVIE_GENRES) {
		var vm = this;

		vm.movieGenres 	= MOVIE_GENRES;
	}

})();