var movie = angular.module('app.movie', ['app.userMovies']);

movie.controller('MovieController', 
  ['$scope', '$routeParams', 'moviesService', 'authService', 'userMoviesService', '$modal', '$sce',
  function($scope, $routeParams, moviesService, authService, userMoviesService, $modal, $sce){

  // Any time the value of `isLoggedIn` changes, we refetch the user
  $scope.$watch(authService.isLoggedIn, function(newVal, oldVal){
    if (newVal === oldVal) return;
    getUser();
  });

  var initialize = function(){
    $scope.loading = true;

    getUser()
      .then(getMovie($routeParams))
      .then(getFavorites)
      .then(getWatchList)
      .finally(function(){
        $scope.loading = false;
        $scope.movie.isFavorite = isFavorite();
        $scope.movie.isInWatchList = isInWatchList();
      });
  };

  var getMovie = function(routeParams){
    return moviesService.getMovie(routeParams)
      .then(function(response){
        $scope.movie = response;
      });
  };

  var getFavorites = function(){
    return userMoviesService.getFavorites()
      .then(function(response){
        $scope.favorites = response.results;
      });
  };

  var getWatchList = function(){
    return userMoviesService.getWatchList()
      .then(function(response){
        $scope.watchList = response.results;
      });
  };

  var getUser = function(){
    return authService.getUser()
      .then(function(response){
        $scope.user = response;
      });
  };

  var isFavorite = function(){
    return _.contains(_.pluck($scope.favorites, 'id'), $scope.movie.id);
  };

  var isInWatchList = function(){
    return _.contains(_.pluck($scope.watchList, 'id'), $scope.movie.id);
  };

  $scope.playTrailer = function(){
    $scope.trailerUrl = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + $scope.movie.trailers.youtube[0].source);

    $modal.open({
      templateUrl: 'trailer/trailer.html',
      scope: $scope
    });
  };

  $scope.toggleFavorite = function(){
    var options = {
      favorite  : !$scope.movie.isFavorite,
      userId    : $scope.user.id,
      mediaId   : $scope.movie.id
    };

    return userMoviesService.toggleFavorite(options)
      .then(function(response){
        $scope.movie.isFavorite = !$scope.movie.isFavorite;
      });
  };

  $scope.toggleWatchList = function(){
    var options = {
      watchList : !$scope.movie.isInWatchList,
      userId    : $scope.user.id,
      mediaId   : $scope.movie.id
    };

    return userMoviesService.toggleWatchList(options)
      .then(function(response){
        $scope.movie.isInWatchList = !$scope.movie.isInWatchList;
      });
  };

  initialize();

}]);

movie.directive('movieListItem', function(){
  return {
    restrict: 'E',
    templateUrl: 'movie/movie_list_item.html'
  };
});