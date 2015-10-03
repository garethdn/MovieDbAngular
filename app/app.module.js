// John Papa [Style Y101] IIFE
(function(){
  'use strict';
  // John Papa [Style Y170] Startup logic
  angular
    .module('app', [
      // angular modules
      'ui.router',
      'ngCookies',
      // 3rd party modules
      'ui.bootstrap',
      // app modules
      'components',
      'app.authentication',
      'app.header',
      // 'app.account',
      'app.movie',
      'app.movies'
    ]);

})();
