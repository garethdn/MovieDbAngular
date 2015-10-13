// Filter arrays by a unique property
(function(){
  'use strict';

  angular
    .module('filters')
    .filter('mdbUnique', mdbUnique);

  mdbUnique.$inject = ['_'];

  function mdbUnique(_) {
    return function (arr, prop) {
      return _.uniq(arr, function(a) { 
        return a[prop]; 
      });
    };
  }

})();