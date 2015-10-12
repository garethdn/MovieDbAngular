(function(){
  'use strict';

  angular
    .module('components')
    .directive('mdbShowcaseItem', mdbShowcaseItem);

  mdbShowcaseItem.$inject = [];

  function mdbShowcaseItem() {
    var directive = {
      restrict: 'E',
      scope: {
        item: '=',
        baseImageUrl: '='
      },
      link: link,
      templateUrl: 'components/showcaseItem/showcaseItem.directive.html',
      replace: true
    };

    function link(scope, element, attrs) {
      scope.getBackgroundImage = getBackgroundImage;
    }

    function getBackgroundImage(scope) {
      return 'url(' + scope.baseImageUrl + 'w500' + scope.item.backdrop_path + ')';
    }

    return directive;
  }

})();