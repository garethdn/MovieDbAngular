(function(){
	'use strict';

	angular
		.module('app.header')
		.controller('AppHeaderController', AppHeaderController);

	AppHeaderController.$inject = ['$scope', '$modal', 'authService', 'moviesService', 'movieGenres'];

	function AppHeaderController($scope, $modal, authService, moviesService, movieGenres) {
		var vm = this;

		vm.movieGenres 	= movieGenres;
		vm.logout 			= authService.logout;
	}

})();