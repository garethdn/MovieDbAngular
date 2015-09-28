(function(){
  'use strict';

  angular
    .module('app.movies')
    .controller('MoviesController', MoviesController);

  MoviesController.$inject = ['$scope', 'moviesService', '$routeParams', 'PAGINATION_SETTINGS', 'MOVIE_TYPES', 'DEFAULT_MOVIE_TYPE'];

  function MoviesController($scope, moviesService, $routeParams, PAGINATION_SETTINGS, MOVIE_TYPES, DEFAULT_MOVIE_TYPE) {
    var vm = this;

    vm.type         = $routeParams.type ? MOVIE_TYPES[$routeParams.type] : MOVIE_TYPES[DEFAULT_MOVIE_TYPE];
    vm.pageHeader   = vm.type + ' movies';
    vm.getMovies    = getMovies;

    moviesService.getViewModelDefaults.apply(vm, [PAGINATION_SETTINGS]);

    activate();
    //////////////

    function activate() {
      getMovies();
    }

    function getMovies() {
      var ms = moviesService;

      vm.loading = true;

      return ms.getMovies($routeParams.type || DEFAULT_MOVIE_TYPE, vm.pagination.currentPage).then(function(response){
        ms.updateViewModel.apply(vm, [response]);

        return vm;
      });
    }
  }

})();
