(function(){
  'use strict';

  angular
    .module('app.person')
    .controller('PersonController', PersonController);

  PersonController.$inject = ['personService', '$stateParams'];

  function PersonController(personService, $stateParams) {
    var vm = this;

    vm.loading = true;
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