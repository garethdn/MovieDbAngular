(function(){
  'use strict';

  angular
    .module('app.person')
    .controller('PersonController', PersonController);

  PersonController.$inject = ['personService', '$stateParams', 'API_SETTINGS', '_'];

  function PersonController(personService, $stateParams, API_SETTINGS, _) {
    var vm = this;

    vm.loading = true;
    vm.API_SETTINGS = API_SETTINGS;
    vm.person = {};
    vm.getMovieDecades = getMovieDecades;

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

    function getMovieDecades(movies) {
      var releaseDates = _.chain(movies)
        .pluck('release_date')
        .compact()
        .value();

      var release_years = _.map(releaseDates, function(val, key){
        return val.split('-')[0];
      });

      return _.chain(release_years).uniq().sort().reverse().value();
    }
  }

})();