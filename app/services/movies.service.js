(function(){
	'use strict';

	angular
		.module('app.movies')
		.factory('moviesService', moviesService);

		moviesService.$inject = ['$http', 'API_SETTINGS'];

		function moviesService($http, API_SETTINGS) {
			var factory = {
				getMovie 					: getMovie,
				getMovies 				: getMovies,
				getMoviesByGenre	: getMoviesByGenre
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
				data.directors 	= _.where(data.credits.crew, { job: 'Director' });
				data.writers 		= _.where(data.credits.crew, { department: 'Writing' });

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

		function getMovieCollection(url, page) {
			return $http.get(url, { 
	    	params: { 
		      'api_key'   : API_SETTINGS.key,
		      'page'      : page || 1
		    }})
		    .success(onMovieCollectionSuccess)
				.error(onMovieCollectionError);
		}

		function onMovieCollectionSuccess(data, status, headers, config) {
			return data;
		}

		function onMovieCollectionError(error) {
			return error;
		}

		return factory;
	}

})();
