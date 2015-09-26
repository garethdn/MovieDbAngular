(function(){
  'use strict';
  // John Papa [Style Y128] Configuration
  angular
    .module('app')
    .config(routeConfig);

  // Look into using ui router's $stateProvider instead
  routeConfig.$inject = ['$routeProvider'];

  function routeConfig($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl : 'authentication/login.html',
        controller  : 'AuthenticationController'
      })
      .when('/account', {
        templateUrl : 'account/account.html',
        controller  : 'AccountController'
      })
      .when('/movies', {
        templateUrl : 'movies/movies.html',
        controller  : 'MoviesController'
      })
      .when('/movies/favorites', {
        templateUrl : 'movies/movies.html',
        controller  : 'MovieFavoritesController'
      })
      .when('/movies/watchlist', {
        templateUrl : 'movies/movies.html',
        controller  : 'MovieWatchlistController'
      })
      .when('/movies/rated', {
        templateUrl : 'movies/movies.html',
        controller  : 'RatedMoviesController'
      })
      .when('/movies/:type', {
        templateUrl : 'movies/movies.html',
        controller  : 'MoviesController',
        controllerAs: 'moviesCtrl'
      })
      .when('/movies/genre/:id', {
        templateUrl : 'movies/movies.html',
        controller  : 'MovieGenresController',
        controllerAs: 'moviesCtrl'
      })
      .when('/movie/:id', {
        templateUrl : 'movie/movie.html',
        controller  : 'MovieController',
        controllerAs: 'movieCtrl'
      })
      .otherwise({redirectTo: '/login'});
  };

})();