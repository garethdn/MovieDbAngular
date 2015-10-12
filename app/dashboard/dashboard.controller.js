(function(){
  'use strict';

  angular
    .module('app.dashboard')
    .controller('DashboardController', DashboardController);

  DashboardController.$inject = ['moviesService', 'MOVIE_GENRES', '$q'];

  function DashboardController(moviesService, MOVIE_GENRES, $q) {
    var vm = this;
    vm.loading = true;

    activate();

    function activate() {
      $q.all([getPopularMovies(), getHighestRatedMovies()]).then(function(response){
        vm.popularItems = response[0].data.results;
        vm.highestRatedItems = response[1].data.results;

        vm.loading = false;
      });
    }

    function getPopularMovies() {
      return moviesService.getMovies('popular');
    }

    function getHighestRatedMovies() {
      return moviesService.getMovies('top_rated');
    }
  }
  
})();