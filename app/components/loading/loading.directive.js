(function(){
  'use strict';

  angular
    .module('components')
    .directive('mdbLoading', mdbLoading);

  mdbLoading.$inject = [];

  function mdbLoading() {
    var directive = {
      restrict: 'A',
      scope: {
        loading: '='
      },
      templateUrl: 'components/loading/loading.directive.html',
      transclude: true
    };

    return directive;
  }

})();