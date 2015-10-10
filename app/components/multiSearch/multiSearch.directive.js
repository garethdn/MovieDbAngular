// John Papa [Style Y070] One directive per file
(function(){
  'use strict';

  angular
    .module('components')
    // John Papa [Style Y073] Unique directive prefix mdb (movieDb)
    .directive('mdbMultiSearch', mdbMultiSearch);

  function mdbMultiSearch() {
    // John Papa [Style Y075] Use controller as syntax with a directive to be consistent with using controller as with view and controller pairings
    var directive = {
      restrict        : 'A',
      controller      : MultiSearchController,
      controllerAs    : 'search',
      bindToController: true
    };

    MultiSearchController.$inject = ['moviesService', '_', '$scope'];

    function MultiSearchController(moviesService, _, $scope) {
      var vm = this;

      vm.multiSearch      = multiSearch;
      vm.onSelectResult   = onSelectResult;
      vm.API_SETTINGS     = $scope.app.API_SETTINGS;

      function multiSearch(){
        // TODO: see if there is a cleaner way to do this
        // TODO: order by popularity, then strip off the first 10
        return moviesService.multiSearch(vm.query).then(function(response){
          // Not bothering with TV results
          var formattedResults = formatResults(response.data.results);

          _.each(formattedResults, function(result){
            if (result.media_type === "movie") {
              result.displayName = result.title;
              result.mediaLink = 'movie/' + result.id;
            } else {
              result.displayName = result.name;
              result.mediaLink = 'person/' + result.id;
            }
          }, this);

          return _.take(formattedResults, 10);
        });
      }

      function onSelectResult($item, $model, $label){
        vm.query = '';
      }

      function formatResults(collection) {
        return filterOutTv(collection);
      }

      function filterOutTv(collection) {
        return _.reject(collection, function(item){
          return item.media_type === 'tv';
        });
      }

    }

    return directive;
  }

})();
