(function(){
  'use strict';

  angular
    .module('app')
    .controller('AppController', AppController);

  AppController.$inject = ['$modal', 'authenticationService', '$scope', 'API_SETTINGS'];

  function AppController($modal, authenticationService, $scope, API_SETTINGS) {
    var vm = this;

    vm.user           = {};
    vm.API_SETTINGS   = API_SETTINGS;
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
        if (newVal === oldVal) {
          return;
        }
        vm.user = authenticationService.user;
      }, true);
    }

    function openLoginModal() {
      $modal.open({
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
