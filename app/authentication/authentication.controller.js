(function(){
  'use strict';

  angular
    .module('app.authentication')
    .controller('AuthenticationController', AuthenticationController);

  AuthenticationController.$inject = ['authenticationService', '$modalInstance'];

  function AuthenticationController(authenticationService, $modalInstance){
    var vm = this;

    vm.title      = "This is a test!";
    vm.loading    = false;
    vm.closeModal = closeModal;
    vm.login      = login;
    vm.user       = {
      username    : '',
      password    : ''
    };

    function closeModal() {
      $modalInstance.close();
    }

    function login() {
      vm.loading = true;

      authenticationService.login(vm.user)
        .then(onLoginSuccess, onLoginError)
        .finally(function(){
          vm.loading = false;
        });
    }

    function onLoginSuccess(response) {
      console.info('Auth Controller -> login successful', response);

      vm.user = response.data;
      $modalInstance.dismiss();
    }

    function onLoginError(response) {
      console.error('Auth Controller -> login failed', response);
    }

    return vm;
  }

})();