(function(){
  'use strict';

  angular
    .module('app.movies')
    .controller('MovieGenresController', MovieGenresController);

  MovieGenresController.$inject = ['moviesService', '$routeParams', 'PAGINATION_SETTINGS', 'MOVIE_GENRES'];

  function MovieGenresController(moviesService, $routeParams, PAGINATION_SETTINGS, MOVIE_GENRES) {
    var vm = this;

    vm.genre        = _.result(_.findWhere(MOVIE_GENRES, { id: parseInt($routeParams.id, 10) }), 'label');
    vm.pageHeader   = vm.genre + ' movies';
    vm.getMovies    = getMovies;

    moviesService.getViewModelDefaults.apply(vm, [PAGINATION_SETTINGS]);

    activate();
    ///////////////

    function activate() {
      getMovies();
    }

    function getMovies() {
      var ms = moviesService;

      vm.loading = true;

      return moviesService.getMoviesByGenre($routeParams.id, vm.pagination.currentPage).then(function(response){
        ms.updateViewModel.apply(vm, [response]);

        return vm;
      });
    }
  }

})();
