(function(){
  'use strict';
  // John Papa [Style Y128] Configuration
  angular
    .module('app')
    .config(stateConfig);

  stateConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

  function stateConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      // .state('login', {
      //   url         : '/login',
      //   templateUrl : 'authentication/login.html',
      //   controller  : 'AuthenticationController'
      // })
      // .state('account', {
      //   url         : '/account',
      //   templateUrl : 'account/account.html',
      //   controller  : 'AccountController'
      // })
      .state('movie', {
        url           : '/movie/:id',
        templateUrl   : 'movie/movie.html',
        controller    : 'MovieController',
        controllerAs  : 'movieCtrl'
      })
      .state('moviesGenres', {
        url           : '/movies/genre/:id',
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
      });
      
      $urlRouterProvider.otherwise('/login');
  }

})();