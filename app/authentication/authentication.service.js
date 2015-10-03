(function(){
  'use strict';

  angular
    .module('app.authentication')
    .factory('authenticationService', authenticationService);

  authenticationService.$inject = ['$http', '$cookies', '$q', 'API_SETTINGS'];

  function authenticationService($http, $cookies, $q, API_SETTINGS) {
    var credentials;

    var factory = {
      user          : {},
      login         : login,
      logout        : logout,
      getUser       : getUser,
      isLoggedIn    : isLoggedIn,
      getSessionId  : getSessionId
    };

    return factory;

    function login(user) {
      credentials = user;

      return createNewToken()
        .then(function(response) {
          return validateWithCredentials(response)
            .then(function(response){
              return createNewSession(response)
                .then(function(response){
                  saveSessionId(response);
                  return getUser(response);
                }, onLoginError);
            }, onInvalidCredentials);
        }, onTokenFailed);
    }

    function createNewToken() {
      console.info('Auth Service -> Creating token');
      return $http.get(API_SETTINGS.url + '/authentication/token/new', { 
        params: { 
          'api_key': API_SETTINGS.key 
        }});
    }

    function validateWithCredentials(response) {
      console.info('Auth Service -> Validating with credentials');
      return $http.get(API_SETTINGS.url + '/authentication/token/validate_with_login', { 
        params: { 
          'api_key'       : API_SETTINGS.key,
          'request_token' : response.data.request_token,
          'username'      : credentials.username,
          'password'      : credentials.password
        }});
    }

    function createNewSession(response) {
      console.info('Auth Service -> Creating new session');
      return $http.get(API_SETTINGS.url + '/authentication/session/new', { 
        params: { 
          'api_key'       : API_SETTINGS.key,
          'request_token' : response.data.request_token
        }});
    }

    function getUser(response) {
      console.info('Auth Service -> Getting user');
      return $http.get(API_SETTINGS.url + '/account', { 
        params: { 
          'api_key'     : API_SETTINGS.key,
          'session_id'  : $cookies.get('sessionId')
        }})
        .then(function(response) {
          factory.user = response.data;
          return response;
        }, function(response) {
          return response;
        });
    }

    function logout() {
      console.info('Auth Service -> Logging out...');
      // The API doesn't appear to have any way to logout so simply deleting the session if here and the cached user
      $cookies.remove('sessionId');
      factory.user = {};
    }

    function isLoggedIn() {
      // For our purposes the user is logged in if there is a session id and the user is not an empty object
      return $cookies.get('sessionId') && !_.isEmpty(factory.user);
    }

    function getSessionId() {
      return $cookies.get('sessionId');
    }

    /*
     *
     * Network requests complete callbacks
     *
     */
    function onTokenFailed(response){
      console.error('Auth Service -> Failed to create token - check URL and api key');
      return $q.reject(response);
    }

    function onInvalidCredentials(response) {
      console.error('Auth Service -> Invalid credentials');
      return $q.reject(response);
    }

    function onLoginError(response) {
      console.error('Auth Service -> Failed to login');
      return $q.reject(response);
    }

    function saveSessionId(response) {
      console.log('Auth Service -> Login success, saving session id');
      $cookies.put('sessionId', response.data.session_id);
      return response;
    }

  }

})();
