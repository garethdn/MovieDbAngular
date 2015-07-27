var movie = angular.module('app.movie', ['app.userMovies']);

movie.controller('MovieController', 
  ['$scope', '$routeParams', 'moviesService', 'authService', 'userMoviesService',
  function($scope, $routeParams, moviesService, authService, userMoviesService){

  $scope.$watch(authService.isLoggedIn, function(newVal, oldVal){
    if (newVal === oldVal) return;
    getUser();
  });

  var initialize = function(){
    $scope.loading = true;

    getUser()
      .then(getMovie($routeParams))
      .then(getFavorites)
      .finally(function(){
        $scope.loading = false;
        $scope.movie.isFavorite = isFavorite();
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
        $scope.favorites = response;
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

  initialize();

}]);

movie.directive('movieListItem', function(){
  return {
    restrict: 'E',
    templateUrl: 'movie/movie_list_item.html'
  };
});