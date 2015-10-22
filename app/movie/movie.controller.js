(function(){
  'use strict';

  angular
    .module('app.movie')
    .controller('MovieController', MovieController);

  MovieController.$inject = ['$scope', '$stateParams', 'moviesService', 'authenticationService', 'API_SETTINGS','$sce', '$uibModal'];

  function MovieController($scope, $stateParams, moviesService, authenticationService, API_SETTINGS, $sce, $uibModal) {
    var vm = this;

    vm.loading          = true;
    vm.movie            = {};
    vm.API_SETTINGS     = API_SETTINGS;
    vm.toggleFavorite   = toggleFavorite;
    vm.toggleWatchlist  = toggleWatchlist;
    vm.ratingChanged    = ratingChanged;
    vm.getTrailer       = getTrailer;
    vm.playTrailer      = playTrailer;
    vm.torrentsLoading  = false;
    vm.playTorrent      = playTorrent;

    // John Papa [Style Y080] Resolve start-up logic for a controller in an `activate` function.
    activate();

    function activate() {
      getMovie().then(getTorrentInfo);
      watchUser();
    }

    function getMovie() {
      return moviesService.getMovie($stateParams).then(function(response){
        vm.movie    = response.data;
        vm.loading  = false;

        return vm.movie;
      });
    }

    function toggleFavorite() {
      if (!authenticationService.isLoggedIn()) {
        return $scope.app.openLoginModal();
      }

      var options = {
        mediaId   : vm.movie.id,
        favorite  : !vm.movie.account_states.favorite
      };

      return moviesService.toggleFavorite(options).then(function(){
        vm.movie.account_states.favorite = !vm.movie.account_states.favorite;
      });
    }

    function toggleWatchlist() {
      if (!authenticationService.isLoggedIn()) {
        return $scope.app.openLoginModal();
      }

      var options = {
        mediaId   : vm.movie.id,
        watchlist : !vm.movie.account_states.watchlist
      };

      return moviesService.toggleWatchlist(options).then(function(){
        vm.movie.account_states.watchlist = !vm.movie.account_states.watchlist;
      });
    }

    function ratingChanged() {
      var options = {
        id      : vm.movie.id,
        rating  : vm.movie.account_states.rated.value
      };  
      
      return moviesService.rate(options);    
    }

    function getTrailer() {
      return vm.movie && 
        vm.movie.trailers &&
        vm.movie.trailers.youtube.length ? vm.movie.trailers.youtube[0].source : '';
    }

    function playTrailer(){
      $scope.trailerUrl = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + getTrailer());

      $uibModal.open({
        templateUrl: 'trailer/trailer.html',
        scope: $scope
      });
    }

    /*
     *
     * The reason we need to watch the user here is for the scenario where a non-logged-in user tries to perform an action
     * that requires authentication, after they log in through the modal our `movie` object does not contain the `account_states`
     * property meaning that we'll get an error if they try to `toggleFavorite` or `toggleWatchlist`. 
     *
     * Therefore we watch for the user changing and then refetch the movie
     *
     */
    function watchUser() {
      $scope.$watch(function(){
        return authenticationService.user;
      }, function(newVal, oldVal){
        if (newVal === oldVal) {
          return;
        }
        getMovie();
      });
    }

    function getTorrentInfo() {
      if (!vm.movie.imdb_id) {
        return;
      }

      vm.torrentsLoading = true;

      return moviesService.getTorrentInfo(vm.movie).then(function(response){
        vm.movie.torrents = response.data.data.movies.length ? response.data.data.movies[0].torrents : [];
        vm.torrentsLoading = false;
      }, function(){
        vm.torrentsLoading = false;
        vm.movie.torrentsError = true;
      });
    }

    function playTorrent(torrent) {
      vm.torrentUrl = 'play-torrent/' + torrent.hash;
    }

  }

})();
