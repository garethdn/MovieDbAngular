(function(){
  'use strict';
  // John Papa [Style Y128] Configuration
  angular
    .module('app')
    .config(stateConfig)
    .config(magnetLinks);

  stateConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];
  magnetLinks.$inject = ['$compileProvider'];

  function stateConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    // Defer all routing until we fetch the user in the run block in `app.run.js`
    $urlRouterProvider.deferIntercept();

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
      })
      .state('index', {
        url           : '/',
        templateUrl   : 'dashboard/dashboard.html',
        controller    : 'DashboardController',
        controllerAs  : 'dashCtrl'
      });

      // use the HTML5 History API
      $locationProvider.html5Mode(true);
  }

  function magnetLinks($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|magnet):/);
  }

})();