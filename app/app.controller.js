(function(){
  'use strict';

  angular
    .module('app')
    .controller('AppController', AppController);

  AppController.$inject = ['$modal', '$controller', 'authenticationService', '$scope'];

  function AppController($modal, $controller, authenticationService, $scope) {
    var vm = this;

    vm.user           = {};
    vm.openLoginModal = openLoginModal;
    vm.logout         = logout;

    activate();

    function activate() {
      watchUser();
    }

    function watchUser() {
      $scope.$watch(function(){
        return authenticationService.user;
      }, function(newVal, oldVal){
        console.info('App Controller -> user watch triggered', newVal);
        vm.user = authenticationService.user;
      }, true);
    }

    function openLoginModal() {
      var loginModal = $modal.open({
        templateUrl       : 'app_header/login_modal.html',
        controller        : 'AuthenticationController',
        controllerAs      : 'authCtrl',
        bindToController  : true
      });
    }

    function logout() {
      authenticationService.logout();
    }
  }

})();
