var account = angular.module('app.account', []);

account.controller('AccountController', ['$scope', 'authService', function($scope, authService){

  var getUser = function(){
    $scope.loading = true;

    return authService.getUser()
      .then(function(response){
        $scope.user = response;
        $scope.loading = false;
      });
  };

  getUser();

}]);