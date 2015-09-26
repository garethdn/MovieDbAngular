(function(){
  'use strict';

  angular
    .module('app.movies')
    .controller('MoviesController', MoviesController);

  MoviesController.$inject = ['moviesService', '$routeParams', 'PAGINATION_SETTINGS'];

  function MoviesController(moviesService, $routeParams, PAGINATION_SETTINGS) {
    var vm = this;

    vm.loading      = true;
    vm.movies       = [];
    vm.pageHeader   = '';
    vm.getMovies    = getMovies
    vm.pagination   = {
      itemsPerPage  : PAGINATION_SETTINGS.itemsPerPage,
      maxSize       : PAGINATION_SETTINGS.maxSize,
      totalItems    : 0,
      currentPage   : 1
    };

    activate();

    function activate() {
      getMovies();
    }

    function getMovies() {
      vm.loading = true;

      return moviesService.getMovies($routeParams.type, vm.pagination.currentPage).then(function(response){
        vm.loading      = false;
        vm.movies       = response.data.results;

        vm.pagination.totalItems   = response.data.total_results;
        vm.pagination.currentPage  = response.data.page;

        return vm;
      });
    }
  }

})();
