var movies = angular.module('app.movies', ['app.movie', 'ui.bootstrap.pagination']);

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

movies.factory('moviesService', ['$http', '$q', '$cookies','authService', function($http, $q, $cookies, accountService){
  var factory = {},
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

  return factory;

}]);

