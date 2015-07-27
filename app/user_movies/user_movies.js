var userMovies = angular.module('app.userMovies', []);

userMovies.factory('userMoviesService', ['$http', '$q', 'authService', function($http, $q, authService){
  var factory = {},
    apiStub   = 'http://api.themoviedb.org/3',
    apiKey    = '05fa93373002b486f99f4b5b15197746';

  factory.getFavorites = function(options){
    var deferred = $q.defer();

    if ( !authService.isLoggedIn() ) {
      deferred.reject([]);
      return deferred.promise;
    }

    $http.get(apiStub + '/account/' + authService.user.id + '/favorite/movies', { params: { 
      'api_key'   : apiKey,
      'session_id': authService.getSessionId()
    }}).
    success(function(data, status, headers, config) {
      deferred.resolve(data.results);
    }).
    error(function(data, status, headers, config) {
      deferred.reject(data);
    });

    return deferred.promise;
  };

  factory.toggleFavorite = function(options){
    var deferred = $q.defer();

    if ( !authService.isLoggedIn ) {
      deferred.reject({ Message: 'Not logged in' });
      return deferred.promise;
    }

    $http({
        method: 'POST',
        url: apiStub + '/account/' + authService.user.id + '/favorite',
        data: $.param({ 
          'api_key'   : apiKey,
          'media_type': 'movie',
          'media_id'  : options.mediaId,
          'favorite'  : options.favorite,
          'session_id': authService.getSessionId()
        }),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).
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