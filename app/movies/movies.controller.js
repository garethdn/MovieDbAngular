(function(){
  'use strict';

  angular
    .module('app.movies')
    .controller('MoviesController', MoviesController);

  MoviesController.$inject = ['$scope', '$location', 'moviesService', '$stateParams', 'PAGINATION_SETTINGS', 'MOVIE_TYPES', 'MOVIE_GENRES', 'DEFAULT_MOVIE_TYPE', '$state'];

  function MoviesController($scope, $location, moviesService, $stateParams, PAGINATION_SETTINGS, MOVIE_TYPES, MOVIE_GENRES, DEFAULT_MOVIE_TYPE, $state) {
    var vm = this;

    vm.loading      = true;
    vm.pageChanged  = pageChanged;
    vm.movies       = [];
    vm.pagination   = {
      itemsPerPage  : PAGINATION_SETTINGS.itemsPerPage,
      maxSize       : PAGINATION_SETTINGS.maxSize,
      totalItems    : 0,
      currentPage   : parseInt($stateParams.page, 10)
    };

    switch($state.current.name) {
      case 'movies':
        vm.type         = $stateParams.type ? MOVIE_TYPES[$stateParams.type] : MOVIE_TYPES[DEFAULT_MOVIE_TYPE];
        vm.pageHeader   = vm.type + ' movies';
        vm.loadMovies   = getMovies;

        break;

      case 'moviesGenres':
        vm.genre        = _.result(_.findWhere(MOVIE_GENRES, { id: parseInt($stateParams.id, 10) }), 'label');
        vm.pageHeader   = vm.genre + ' movies';
        vm.loadMovies   = getMovieGenres;

        break;

      case 'moviesFavorites':
        vm.pageHeader   = 'My favorite movies';
        vm.loadMovies   = getMovieFavorites;

        break;

      case 'moviesWatchlist':
        vm.pageHeader   = 'My watchlist';
        vm.loadMovies   = getMovieWatchlist;

        break;

      case 'moviesRated':
        vm.pageHeader   = 'My rated movies';
        vm.loadMovies   = getRatedMovies;

        break;
    }

    activate();
    ///////////////

    function activate() {
      vm.loadMovies();
    }

    function getMovies() {
      vm.loading = true;

      return moviesService.getMovies($stateParams.type, vm.pagination.currentPage)
        .then(onLoadMoviesSuccess);
    }

    function getMovieGenres() {
      vm.loading = true;

      return moviesService.getMoviesByGenre($stateParams.id, vm.pagination.currentPage)
        .then(onLoadMoviesSuccess);
    }

    function getMovieFavorites() {
      vm.loading = true;

      return moviesService.getFavorites(vm.pagination.currentPage)
        .then(onLoadMoviesSuccess);
    }

    function getMovieWatchlist() {
      vm.loading = true;

      return moviesService.getWatchlist(vm.pagination.currentPage)
        .then(onLoadMoviesSuccess);
    }

    function getRatedMovies() {
      vm.loading = true;

      return moviesService.getRated(vm.pagination.currentPage)
        .then(onLoadMoviesSuccess);
    }

    function onLoadMoviesSuccess(response) {
      vm.loading      = false;
      vm.movies       = response.data.results;

      vm.pagination.totalItems   = response.data.total_results;

      console.info('Movies controller -> Current page is', vm.pagination.currentPage);
      console.info('Movies controller -> Page returned from server is', response.data.page);

      return vm;
    }

    function pageChanged() {
      console.info('Movies controller -> page changed to', vm.pagination.currentPage);
      $location.search('page', vm.pagination.currentPage);
    }

  }

})();
