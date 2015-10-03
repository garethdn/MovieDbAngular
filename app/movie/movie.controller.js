(function(){
  'use strict';

  angular
    .module('app.movie')
    .controller('MovieController', MovieController);

  MovieController.$inject = ['$scope', '$stateParams', 'moviesService'];

  function MovieController($scope, $stateParams, moviesService) {
    var vm = this;

    vm.loading          = true;
    vm.movie            = {};
    vm.toggleFavorite   = toggleFavorite;
    vm.toggleWatchlist  = toggleWatchlist;

    // John Papa [Style Y080] Resolve start-up logic for a controller in an `activate` function.
    activate();

    function activate() {
      return moviesService.getMovie($stateParams).then(function(response){
        vm.movie    = response.data;
        vm.loading  = false;

        return vm.movie;
      });
    }

    function toggleFavorite() {
      var options = {
        mediaId   : vm.movie.id,
        favorite  : !vm.movie.account_states.favorite
      };

      return moviesService.toggleFavorite(options).then(function(response){
        vm.movie.account_states.favorite = !vm.movie.account_states.favorite;
      });
    }

    function toggleWatchlist() {
      var options = {
        mediaId   : vm.movie.id,
        watchlist : !vm.movie.account_states.watchlist
      };

      return moviesService.toggleWatchlist(options).then(function(response){
        vm.movie.account_states.watchlist = !vm.movie.account_states.watchlist;
      });
    }
  }

})();
