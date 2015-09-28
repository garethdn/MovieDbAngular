(function(){
  'use strict';

  angular
    .module('app.movies')
    .factory('moviesService', moviesService);

  moviesService.$inject = ['$http', 'API_SETTINGS'];

  function moviesService($http, API_SETTINGS) {
    var factory = {
      getMovie              : getMovie,
      getMovies             : getMovies,
      getMoviesByGenre      : getMoviesByGenre,
      multiSearch           : multiSearch,
      getViewModelDefaults  : getViewModelDefaults,
      updateViewModel       : updateViewModel
    };

    function getMovie(options){
      var url = API_SETTINGS.url + '/movie/' + options.id;

      return $http.get(url, { 
        params: { 
          'api_key'             : API_SETTINGS.key,
          'append_to_response'  : 'credits,trailers,similar'
        }})
        .success(onSuccess)
        .error(onError);

      function onSuccess(data, status, headers, config) {
        data.directors  = _.where(data.credits.crew, { job: 'Director' });
        data.writers    = _.where(data.credits.crew, { department: 'Writing' });

        return data;
      }

      function onError(error) {
        return error;
      }
    };

    function getMovies(type, page) {
      var url = API_SETTINGS.url + '/movie/' + (type || 'popular');

      return getMovieCollection(url, page);
    }

    function getMoviesByGenre(id, page) {
      var url = API_SETTINGS.url + '/genre/' + id + '/movies';

      return getMovieCollection(url, page);
    }

    // Maybe this could be in a shared tv/movie service but keeping it here for now
    function multiSearch(query) {
      var url = API_SETTINGS.url + '/search/multi';

      return $http.get(url, { 
        params: { 
          'api_key' : API_SETTINGS.key,
          'query'   : query
        }})
        .success(onMovieCollectionSuccess)
        .error(onMovieCollectionError);
    }

    function getMovieCollection(url, page) {
      return $http.get(url, { 
        params: { 
          'api_key'   : API_SETTINGS.key,
          'page'      : page || 1
        }})
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

    // TODO: maybe these methods below should be moved to a movie helpers service 
    // and leave this file responsible for data retrieval only

    // Shared method for setting defaults for the various movie collection controllers
    function getViewModelDefaults(PAGINATION_SETTINGS) {
      this.loading      = true;
      this.movies       = [];
      this.pagination   = {
        itemsPerPage  : PAGINATION_SETTINGS.itemsPerPage,
        maxSize       : PAGINATION_SETTINGS.maxSize,
        totalItems    : 0,
        currentPage   : 1
      };

      return this;
    }

    // Shared method for updating the view model for the various movie collection controllers
    function updateViewModel(response) {
      this.loading      = false;
      this.movies       = response.data.results;

      this.pagination.totalItems   = response.data.total_results;
      this.pagination.currentPage  = response.data.page;

      return this;
    }

    return factory;
  }

})();
