// John Papa [Style Y070] One directive per file
(function(){
  'use strict';

  angular
    .module('components')
    // John Papa [Style Y073] Unique directive prefix mdb
    .directive('mdbBackdrop', mdbBackdrop);

  mdbBackdrop.$inject = ['$log', 'API_SETTINGS'];

  function mdbBackdrop($log, API_SETTINGS) {
    // John Papa [Style Y075] Use controller as syntax with a directive to be consistent with using controller as with view and controller pairings
    var directive = {
      restrict    : 'E',
      link        : link,
      scope       : {
        path: '='
      },
      templateUrl : 'components/backdrop/backdrop.directive.html'
    };

    /* jshint unused:false */
    function link(scope, element, attrs) {
      var img = angular.element(element[0].querySelector('img'));

      scope.API_SETTINGS = API_SETTINGS;

      img.on('load', function(){
        scope.$apply(function(){
          scope.loaded = true;
        });
      });
    }

    return directive;
  }

})();
