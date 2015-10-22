(function(){
  'use strict';

  angular
    .module('app.movies')
    .factory('moviesService', moviesService);

  moviesService.$inject = ['$http', '_', 'API_SETTINGS', 'authenticationService', '$q'];

  function moviesService($http, _, API_SETTINGS, authenticationService, $q) {
    var factory = {
      getMovie              : getMovie,
      getMovies             : getMovies,
      getMoviesByGenre      : getMoviesByGenre,
      getFavorites          : getFavorites,
      getWatchlist          : getWatchlist,
      getRated              : getRated,
      toggleFavorite        : toggleFavorite,
      toggleWatchlist       : toggleWatchlist,
      rate                  : rate,
      multiSearch           : multiSearch,
      getTorrentInfo        : getTorrentInfo
    };

    function getMovie(options){
      var url = API_SETTINGS.url + '/movie/' + options.id;

      return $http.get(url, { 
        params: { 
          'append_to_response'  : 'credits,trailers,similar,account_states,lists,releases',
          // `session_id` is required for `account_states` which will include favorite, 
          // watchlist and rating information in the response. If `session_id` is undefined
          // the request will complete regardless, just withtout the `account_states`
          // property in the response
          'session_id'          : authenticationService.getSessionId(),
          // cache busting parameter
          '_'                   : new Date().getTime()
        }})
        .success(onMovieSuccess)
        .error(onMovieError);

      function onMovieSuccess(data, status, headers, config) {
        data.directors  = _.where(data.credits.crew, { job: 'Director' });
        data.writers    = _.where(data.credits.crew, { department: 'Writing' });

        return data;
      }

      function onMovieError(error) {
        return error;
      }
    }

    function getMovies(type, page) {
      var url = API_SETTINGS.url + '/movie/' + (type || 'popular');

      var params = {
        page: page || 1
      };

      return getMovieCollection(url, params);
    }

    function getMoviesByGenre(id, page) {
      var url = API_SETTINGS.url + '/genre/' + id + '/movies';

      var params = {
        page: page || 1
      };

      return getMovieCollection(url, params);
    }

    // Add authentication check for these methods
    function getFavorites(page) {
      // TODO: find out why does this request work even when `authenticationService.user.id` is `undefined`
      if (authenticationService.isLoggedIn()) {
        console.info('Yep logged in');
      } else {
        console.info('Nope NOT logged in');
      }
      var url = API_SETTINGS.url + '/account/' + authenticationService.user.id + '/favorite/movies';
      
      var params = {
        page        : page || 1,
        session_id  : authenticationService.getSessionId()
      };

      return getMovieCollection(url, params);
    }

    function getWatchlist(page) {
      var url = API_SETTINGS.url + '/account/' + authenticationService.user.id + '/watchlist/movies';
      
      var params = {
        page        : page || 1,
        session_id  : authenticationService.getSessionId()
      };

      return getMovieCollection(url, params);
    }

    function getRated(page) {
      var url = API_SETTINGS.url + '/account/' + authenticationService.user.id + '/rated/movies';
      
      var params = {
        page        : page || 1,
        session_id  : authenticationService.getSessionId()
      };

      return getMovieCollection(url, params);
    }

    function toggleFavorite(options) {
      var url = API_SETTINGS.url + '/account/' + authenticationService.user.id + '/favorite?session_id=' + authenticationService.getSessionId();

      // Doing it this way because `$http.post` will not generate a query string even if a params object is provided
      return $http({
        method: 'POST',
        url: url,
        data: {
          'media_type': 'movie',
          'media_id'  : options.mediaId,
          'favorite'  : options.favorite
        }
      }).then(onToggleComplete, onToggleComplete);
    }

    function toggleWatchlist(options) {
      var url = API_SETTINGS.url + '/account/' + authenticationService.user.id + '/watchlist?session_id=' + authenticationService.getSessionId();

      return $http({
        method: 'POST',
        url: url,
        data: {
          'media_type'  : 'movie',
          'media_id'    : options.mediaId,
          'watchlist'   : options.watchlist
        }
      }).then(onToggleComplete, onToggleComplete);
    }

    function onToggleComplete(data, status, headers, config) {
      return data;
    }

    // Performs a POST or DELETE depending on whether a rating value is passed to the method
    function rate(options) {
      var url = API_SETTINGS.url + '/movie/' + options.id + '/rating?session_id=' + authenticationService.getSessionId();

      return $http({
        method: options.rating ? 'POST' : 'DELETE',
        url: url,
        data: {
          'value': options.rating
        }
      }).then(onToggleComplete, onToggleComplete);
    }

    // Maybe this could be in a shared tv/movie service but keeping it here for now
    function multiSearch(query) {
      var url = API_SETTINGS.url + '/search/multi';

      return $http.get(url, { 
        params: { 
          'query'   : query
        }})
        .success(onMovieCollectionSuccess)
        .error(onMovieCollectionError);
    }

    function getMovieCollection(url, params) {
      return $http.get(url, { 
        params: angular.extend({}, { 
          // 'api_key'   : API_SETTINGS.key
        }, params)})
        .success(onMovieCollectionSuccess)
        .error(onMovieCollectionError);
    }

    // We can use these callbacks for all movie collections
    function onMovieCollectionSuccess(data, status, headers, config) {
      return data;
    }

    function onMovieCollectionError(error) {
      return error;
    }

    function getTorrentInfo(movie) {
      var url = 'https://yts.to/api/v2/list_movies.json';

      return $http.get(url, { 
        cache: true,
        params: {
          query_term: movie.imdb_id
        }})
        .then(function(data){
          _.each(data.data.movies, function(movie){
            _.each(movie.torrents, function(torrent){
              torrent.magnet_link = generateMagnetLink(movie.title_long, torrent.hash);
            }, this);
          }, this);
        }, function(error){
          return $q.reject(error);
        });
    }

    function generateMagnetLink(movieTitle, hash) {
      return 'magnet:?xt=urn:btih:' + hash;
    }


    return factory;
  }

})();
