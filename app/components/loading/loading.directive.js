(function(){
  'use strict';

  angular
    .module('components')
    .directive('mdbLoading', mdbLoading);

  mdbLoading.$inject = [];

  function mdbLoading() {
    var directive = {
      restrict: 'A',
      link: link,
      scope: {
        loading: '='
      },
      templateUrl: 'components/loading/loading.directive.html',
      transclude: true
    };

    /* jshint unused:false */
    function link(scope, element, attrs) {
      console.log('is it loading?', scope.loading);

      // Add template above and transclude it
      // That template will be absolutely positioned, 100% width
      // and try to get it to cover 100% of the viewport maybe
    }

    return directive;
  }

})();