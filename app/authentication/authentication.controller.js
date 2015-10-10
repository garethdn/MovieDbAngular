(function(){
  'use strict';

  angular
    .module('app.authentication')
    .controller('AuthenticationController', AuthenticationController);

  AuthenticationController.$inject = ['authenticationService', '$modalInstance', '$log'];

  function AuthenticationController(authenticationService, $modalInstance, $log){
    var vm = this;

    vm.title      = "Login";
    vm.loading    = false;
    vm.login      = login;
    vm.user       = {
      username    : '',
      password    : ''
    };

    function login() {
      vm.loading = true;

      authenticationService.login(vm.user)
        .then(onLoginSuccess, onLoginError)
        .finally(function(){
          vm.loading = false;
        });
    }

    function onLoginSuccess(response) {
      $log.info('Auth Controller -> login successful', response);

      vm.user = response.data;
      $modalInstance.dismiss();
    }

    function onLoginError(response) {
      $log.error('Auth Controller -> login failed', response);
    }

    return vm;
  }

})();