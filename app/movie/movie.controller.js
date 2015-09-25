(function(){
	'use strict';

	angular
		.module('app.movie')
		.controller('MovieController', MovieController);

	MovieController.$inject = ['$scope', '$routeParams', 'moviesService'];

	function MovieController($scope, $routeParams, moviesService) {
		var vm = this;

		vm.loading 	= true;
		vm.movie 	= {};

		// John Papa [Style Y080] Resolve start-up logic for a controller in an `activate` function.
		activate();

		function activate() {
			return moviesService.getMovie($routeParams).then(function(response){
				vm.movie 		= response;
				vm.loading 	= false;

				return vm.movie;
			});
		}
	}

})();
