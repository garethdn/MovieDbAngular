(function(){
  'use strict';

  angular
    .module('app.movies')
    .constant('MOVIE_TYPES', {
      'popular'     : 'Popular',
      'top_rated'   : 'Top rated',
      'upcoming'    : 'Upcoming',
      'now_playing' : 'Now playing'
    })
    .constant('DEFAULT_MOVIE_TYPE', 'popular');

})();
