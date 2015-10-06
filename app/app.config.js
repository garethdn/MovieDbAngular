(function(){
  'use strict';
  // John Papa [Style Y128] Configuration
  angular
    .module('app')
    .config(stateConfig);

  stateConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function stateConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('movie', {
        url           : '/movie/:id',
        templateUrl   : 'movie/movie.html',
        controller    : 'MovieController',
        controllerAs  : 'movieCtrl'
      })
      .state('moviesGenres', {
        url           : '/movies/genre/:id?page',
        templateUrl   : 'movies/movies.html',
        controller    : 'MoviesController',
        controllerAs  : 'moviesCtrl'
      })
      .state('moviesFavorites', {
        url           : '/movies/favorites:type?page',
        templateUrl   : 'movies/movies.html',
        controller    : 'MoviesController',
        controllerAs  : 'moviesCtrl'
      })
      .state('moviesWatchlist', {
        url           : '/movies/watchlist:type?page',
        templateUrl   : 'movies/movies.html',
        controller    : 'MoviesController',
        controllerAs  : 'moviesCtrl'
      })
      .state('moviesRated', {
        url           : '/movies/rated:type?page',
        templateUrl   : 'movies/movies.html',
        controller    : 'MoviesController',
        controllerAs  : 'moviesCtrl'
      })
      .state('movies', {
        url           : '/movies/:type?page',
        templateUrl   : 'movies/movies.html',
        controller    : 'MoviesController',
        controllerAs  : 'moviesCtrl'
      })
      .state('person', {
        url           : '/person/:id',
        templateUrl   : 'person/person.html',
        controller    : 'PersonController',
        controllerAs  : 'personCtrl'
      });
      
      $urlRouterProvider.otherwise('/login');
  }

})();