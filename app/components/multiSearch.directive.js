// John Papa [Style Y070] One directive per file
(function(){
  'use strict';

  angular
    .module('components')
    // John Papa [Style Y073] Unique directive prefix mdb (movieDb)
    .directive('mdbMultiSearch', multiSearch);

    function multiSearch() {
      // John Papa [Style Y075] Use controller as syntax with a directive to be consistent with using controller as with view and controller pairings
      var directive = {
        link            : link,
        restrict        : 'A',
        controller      : MultiSearchController,
        controllerAs    : 'search',
        bindToController: true
      }

      function link(scope, element, attrs) {
        console.log('In the search directve link function');
      }

      MultiSearchController.$inject = ['moviesService'];

      function MultiSearchController(moviesService) {
        var vm = this;

        vm.multiSearch      = multiSearch;
        vm.onSelectResult   = onSelectResult;

        function multiSearch(){
          // TODO: see if there is a cleaner way to do this
          // TODO: order by popularity, then strip off the first 10, then ammend results
          return moviesService.multiSearch(vm.query)
            .then(function(response){
              _.each(response.data.results, function(result){
                if (result.media_type === "movie") {
                  result.displayName = result.title;
                  result.mediaLink = 'movie/' + result.id;
                } else if (result.media_type === "tv") {
                  result.displayName = result.name;
                  result.mediaLink = 'tv/' + result.id;
                } else {
                  result.displayName = result.name;
                  result.mediaLink = 'person/' + result.id;
                }
              }, this);

              return _.first(response.data.results, 10);
            });
        }

        function onSelectResult($item, $model, $label){
          vm.query = '';
        }

      }

      return directive;
    };  

  })();
