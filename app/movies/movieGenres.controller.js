(function(){
  'use strict';

  angular
    .module('app.movies')
    .controller('MovieGenresController', MovieGenresController);

  MovieGenresController.$inject = ['moviesService', '$routeParams', 'PAGINATION_SETTINGS'];

  function MovieGenresController(moviesService, $routeParams, PAGINATION_SETTINGS) {
    var vm = this;

    vm.loading      = true;
    vm.movies       = [];
    vm.pageHeader   = '';
    vm.getMovies    = getMoviesByGenre
    vm.pagination   = {
      itemsPerPage  : PAGINATION_SETTINGS.itemsPerPage,
      maxSize       : PAGINATION_SETTINGS.maxSize,
      totalItems    : 0,
      currentPage   : 1
    };

    activate();

    function activate() {
      getMoviesByGenre();
    }

    function getMoviesByGenre() {
      vm.loading = true;

      return moviesService.getMoviesByGenre($routeParams.id, vm.pagination.currentPage).then(function(response){
        vm.loading      = false;
        vm.movies       = response.data.results;

        vm.pagination.totalItems   = response.data.total_results;
        vm.pagination.currentPage  = response.data.page;

        return vm;
      });
    }
  }

})();
