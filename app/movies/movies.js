var movies = angular.module('app.movies', ['app.movie', 'ui.bootstrap.pagination']);

// `MoviesController` for fetching popular, top rated, upcoming and now playing movie collections
movies.controller('MoviesController', 
  ['$scope', '$routeParams', 'moviesService',
  function($scope, $routeParams, moviesService){

  $scope.itemsPerPage = 20;
  $scope.maxSize = 5;

  var typeMap = {
    'popular': 'Popular',
    'top_rated': 'Top rated',
    'upcoming': 'Upcoming',
    'now_playing': 'Now playing'
  };

  $scope.getMovieCollection = function(type, page){
    $scope.loading = true;
    $scope.type = typeMap[type || 'popular'];

    return moviesService.getMovieCollection(type, page)
      .then(function(response){
        $scope.movies = response.results;
        $scope.loading = false;
        $scope.totalItems = response.total_results;
        $scope.currentPage = response.page;
      });
  };

  $scope.pageChanged = function () {
    $scope.getMovieCollection($routeParams.type, $scope.currentPage);
  };

  $scope.getMovieCollection($routeParams.type);

}]);

// Controller for fetching movies by genre
movies.controller('MovieGenreController', 
  ['$scope', '$routeParams', 'moviesService',
  function($scope, $routeParams, moviesService){

  var genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 10769,
      "name": "Foreign"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ];

  $scope.itemsPerPage = 20;
  $scope.maxSize = 5;

  $scope.getMovieGenre = function(id, page){
    $scope.loading = true;
    $scope.type = _.findWhere(genres, { id: parseInt(id, 10) }).name;

    return moviesService.getMovieGenre(id, page)
      .then(function(response){
        $scope.movies = response.results;
        $scope.loading = false;
        $scope.totalItems = response.total_results;
        $scope.currentPage = response.page;
      });
  };

  $scope.pageChanged = function () {
    $scope.getMovieGenre($routeParams.id, $scope.currentPage);
  };

  $scope.getMovieGenre($routeParams.id);

}]);

movies.controller('MovieFavoritesController', ['$scope', 'userMoviesService', function($scope, userMoviesService){
  $scope.itemsPerPage = 20;
  $scope.maxSize = 5;

  $scope.getFavorites = function(page){
    $scope.loading = true;
    $scope.type = 'My favorite';

    return userMoviesService.getFavorites()
      .then(function(response){
        $scope.movies = response.results;
        $scope.loading = false;
        $scope.totalItems = response.total_results;
        $scope.currentPage = response.page;
      });
  };

  $scope.pageChanged = function () {
    $scope.getFavorites($scope.currentPage);
  };

  $scope.getFavorites();
}]);

movies.controller('MovieWatchlistController', ['$scope', 'userMoviesService', function($scope, userMoviesService){
  $scope.itemsPerPage = 20;
  $scope.maxSize = 5;

  $scope.getWatchlist = function(page){
    $scope.loading = true;
    $scope.type = 'My watchlist';

    return userMoviesService.getWatchList()
      .then(function(response){
        $scope.movies = response.results;
        $scope.loading = false;
        $scope.totalItems = response.total_results;
        $scope.currentPage = response.page;
      });
  };

  $scope.pageChanged = function () {
    $scope.getWatchlist($scope.currentPage);
  };

  $scope.getWatchlist();
}]);

movies.controller('RatedMoviesController', ['$scope', 'userMoviesService', function($scope, userMoviesService){
  $scope.itemsPerPage = 20;
  $scope.maxSize = 5;

  $scope.getRatedMovies = function(page){
    $scope.loading = true;
    $scope.type = 'My rated';

    return userMoviesService.getRatedMovies()
      .then(function(response){
        $scope.movies = response.results;
        $scope.loading = false;
        $scope.totalItems = response.total_results;
        $scope.currentPage = response.page;
      });
  };

  $scope.pageChanged = function () {
    $scope.getRatedMovies($scope.currentPage);
  };

  $scope.getRatedMovies();
}]);

movies.factory('moviesService', ['$http', '$q', '$cookies','authService', function($http, $q, $cookies, accountService){
  var factory = {},
    // move these to some other settings file and store as constants
    apiStub   = 'http://api.themoviedb.org/3',
    apiKey    = '05fa93373002b486f99f4b5b15197746';

  $http.get(apiStub + '/genre/movie/list', { params: { 
      'api_key'   : apiKey
    }});

  factory.getMovieCollection = function(type, page){
    var deferred = $q.defer();

    $http.get(apiStub + '/movie/' + (type ? type : 'popular'), { params: { 
      'api_key'   : apiKey,
      'page'      : page || 1
    }}).
    success(function(data, status, headers, config) {
      deferred.resolve(data);
    }).
    error(function(data, status, headers, config) {
      deferred.reject(data);
    });

    return deferred.promise;
  };

  factory.getMovieGenre = function(id, page){
    var deferred = $q.defer();

    $http.get(apiStub + '/genre/' + id + '/movies', { params: { 
      'api_key'   : apiKey,
      'page'      : page || 1
    }}).
    success(function(data, status, headers, config) {
      deferred.resolve(data);
    }).
    error(function(data, status, headers, config) {
      deferred.reject(data);
    });

    return deferred.promise;
  };

  factory.getMovie = function(options){
    var deferred = $q.defer();

    $http.get(apiStub + '/movie/' + options.id, { params: { 
      'api_key'             : apiKey,
      'append_to_response'  : 'credits,trailers,similar'
    }}).
    success(function(data, status, headers, config) {
      data.directors = _.where(data.credits.crew, { job: 'Director' });
      data.writers = _.where(data.credits.crew, { department: 'Writing' });

      deferred.resolve(data);
    }).
    error(function(data, status, headers, config) {
      deferred.reject(data);
    });

    return deferred.promise;
  };

  factory.search = function(query){
    var deferred = $q.defer();

    $http.get(apiStub + '/search/multi', { params: { 
      'api_key' : apiKey,
      'query'   : query
    }}).
    success(function(data, status, headers, config) {
      deferred.resolve(data);
    }).
    error(function(data, status, headers, config) {
      deferred.reject(data);
    });

    return deferred.promise;
  };

  return factory;

}]);

