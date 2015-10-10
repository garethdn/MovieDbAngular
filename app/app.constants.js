(function(){
  'use strict';

  // John Papa [Style Y240] Create an Angular Constant for vendor libraries' global variables.
  angular
    .module('app')
    .constant('Holder', Holder)
    .constant('_', _)
    // TODO: move this to app.movies constants??
    .constant('MOVIE_GENRES', [
      {
        label : "Action",
        id    : 28
      },
      {
        label : "Adventure",
        id    : 12
      },
      {
        label : "Animation",
        id    : 16
      },
      {
        label : "Comedy",
        id    : 35
      },
      {
        label : "Crime",
        id    : 80
      },
      {
        label : "Documentary",
        id    : 99
      },
      {
        label : "Drama",
        id    : 18
      },
      {
        label : "Family",
        id    : 10751
      },
      {
        label : "Fantasy",
        id    : 14
      },
      {
        label : "Foreign",
        id    : 10769
      },
      {
        label : "History",
        id    : 36
      },
      {
        label : "Horror",
        id    : 27
      },
      {
        label : "Music",
        id    : 10402
      },
      {
        label : "Mystery",
        id    : 9648
      },
      {
        label : "Romance",
        id    : 10749
      },
      {
        label : "Science Fiction",
        id    : 878
      },
      {
        label : "TV Movie",
        id    : 10770
      },
      {
        label : "Thriller",
        id    : 53
      },
      {
        label : "War",
        id    : 10752
      },
      {
        label : "Western",
        id    : 37
      }
    ])
    .constant('API_SETTINGS', {
      key           : '05fa93373002b486f99f4b5b15197746',
      url           : 'https://api.themoviedb.org/3',
      baseImageUrl  : 'https://image.tmdb.org/t/p/'
    })
    .constant('PAGINATION_SETTINGS', {
      itemsPerPage  : 20,
      maxSize       : 5
    });

})();
