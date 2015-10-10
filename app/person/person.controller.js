(function(){
  'use strict';

  angular
    .module('app.person')
    .controller('PersonController', PersonController);

  PersonController.$inject = ['personService', '$stateParams', 'API_SETTINGS'];

  function PersonController(personService, $stateParams, API_SETTINGS) {
    var vm = this;

    vm.loading = true;
    vm.API_SETTINGS = API_SETTINGS;
    vm.person = {};

    activate();

    function activate(){
      getPerson();
    }

    function getPerson() {
      return personService.getPerson($stateParams.id).then(function(response){
        vm.loading = false;
        vm.person = response.data;
      });
    }
  }

})();