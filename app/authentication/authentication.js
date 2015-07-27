var login = angular.module('app.login', ['ngRoute', 'ngCookies']);

login.controller('AuthenticationController', ['$scope', 'authService', function($scope, authService) {
  $scope.user = {};

  $scope.login = function(){
    getToken()
      .then(login)
      .then(createSession);
  };

  var getToken = function(){
    return authService.getToken()
      .then(function(response){
        $scope.request_token = response.request_token;
      });
  };

  var login = function(){
    $scope.loading = true;

    return authService.login($scope)
      .then(function(response, status){
        $scope.loading    = false;
        $scope.error      = false;
      }, function(statusCode) {
        $scope.loading    = false;
        $scope.error      = true;
        $scope.errorCode  = statusCode;
      });
  };

  var createSession = function(){
    return authService.createSession($scope)
      .then(function(response){
        $scope.loggedIn = true;
      });
  };

  var getUser = function(){
    return authService.getUser()
      .then(function(response){
        $scope.user = response;
      });
  };

}]);

login.factory('authService', ['$http', '$q', '$cookies', function($http, $q, $cookies){
  var factory = {},
    apiStub   = 'http://api.themoviedb.org/3',
    apiKey    = '05fa93373002b486f99f4b5b15197746',
    sessionId = '';

  factory.user = {};

  factory.login = function(data){
    var deferred = $q.defer();
    
    $http.get(apiStub + '/authentication/token/validate_with_login', { params: { 
        'api_key'       : apiKey,
        'request_token' : data.request_token,
        'username'      : data.user.username,
        'password'      : data.user.password
      }}).
      success(function(data, status, headers, config) {
        deferred.resolve(data, status);
      }).
      error(function(data, status, headers, config) {
        deferred.reject(status);
      });

    return deferred.promise;
  };

  factory.logout = function(){
    delete $cookies.sessionId;
    factory.user = {};
  };

  factory.isLoggedIn = function(){
    return Boolean($cookies.sessionId);
  };

  factory.getToken = function(){
    var deferred = $q.defer();

    $http.get(apiStub + '/authentication/token/new', { params: { 
      'api_key': apiKey 
    }}).
    success(function(data, status, headers, config) {
      deferred.resolve(data);
    }).
    error(function(data, status, headers, config) {
      deferred.reject(data);
    });

    return deferred.promise;
  };

  factory.getUser = function(){
    var deferred = $q.defer();

    // if there is a user id, return the user
    if (factory.user.id && $cookies.sessionId) {
      deferred.resolve(factory.user);
      return deferred.promise;
    }

    // if there is no session id, return nothing
    if (!$cookies.sessionId) {
      factory.user = {};
      deferred.resolve(factory.user);
      return deferred.promise;
    }

    $http.get(apiStub + '/account', { params: { 
      'api_key'   : apiKey,
      'session_id': $cookies.sessionId
    }}).
    success(function(data, status, headers, config) {
      factory.user = angular.extend({}, factory.user, data);
      deferred.resolve(factory.user);
    }).
    error(function(data, status, headers, config) {
      deferred.reject(data);
    });

    return deferred.promise;
  };

  factory.createSession = function(data){
    var deferred = $q.defer();

    $http.get(apiStub + '/authentication/session/new', { params: { 
      'api_key'       : apiKey,
      'request_token' : data.request_token
    }}).
    success(function(data, status, headers, config) {
      $cookies.sessionId = data.session_id;
      deferred.resolve(data);
    }).
    error(function(data, status, headers, config) {
      deferred.reject(data);
    });

    return deferred.promise;
  };

  factory.getSessionId = function(){
    return $cookies.sessionId;
  };

  return factory;
}]);