(function(){
	'use strict';

	angular
		.module('app.header')
		.controller('AppHeaderController', AppHeaderController);

	AppHeaderController.$inject = ['$scope', '$modal', 'moviesService', 'MOVIE_GENRES'];

	function AppHeaderController($scope, $modal, moviesService, MOVIE_GENRES) {
		var vm = this;

		vm.movieGenres 	= MOVIE_GENRES;
	}

})();