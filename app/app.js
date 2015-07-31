// Instantiate a new angular module `app` and specify its dependencies
var app = angular.module('app', [
  'ui.bootstrap',
  'app.login',
  'app.header',
  'app.account',
  'app.movies'
  ]);

// Setup the routes for the app
app.config(['$routeProvider', function($routeProvider) {
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
      controller  : 'MoviesController'
    })
    .when('/movies/genre/:id', {
      templateUrl : 'movies/movies.html',
      controller  : 'MovieGenreController'
    })
    .when('/movie/:id', {
      templateUrl : 'movie/movie.html',
      controller  : 'MovieController'
    })
    .otherwise({redirectTo: '/login'});
}]);

app.directive('imgHolder', function () {
  return {
    link: function (scope, element, attrs) {
      Holder.run({ images: element[0], nocss: true });
    }
  };
});