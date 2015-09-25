var appHeader = angular.module('app.header', ['ngRoute', 'ui.bootstrap.typeahead']);

login.controller('AppHeaderController', ['$scope', '$modal', 'authService', 'moviesService', function($scope, $modal, authService, moviesService) {

  $scope.user = {};

  $scope.$watch(authService.isLoggedIn, function(newVal, oldVal){
    if (newVal === oldVal) return;
    getUser();
  });

  $scope.logout = function(){
    authService.logout();
  };

  $scope.openLoginModal = function(){
    var loginModal = $modal.open({
      templateUrl: 'app_header/login_modal.html',
      controller: 'LoginModalController'
    });
  };

  var getUser = function(){
    return authService.getUser()
      .then(function(response){
        $scope.user = response;
      });
  };

  // TODO: find a better way than this, currently calling `getUser` whenever the `AppHeaderController` is instantiated
  getUser();

}]);

login.controller('LoginModalController', ['$scope', '$controller', '$modalInstance', 'authService', function($scope, $controller, $modalInstance, authService){
  // inherit from AuthenticationController
  // TODO: find out how this works!
  $controller('AuthenticationController', { $scope: $scope });

  $scope.$watch(authService.isLoggedIn, function(newVal, oldVal){
    if (newVal === oldVal) return;
    $scope.closeModal();
  });

  $scope.closeModal = function(){
    $modalInstance.dismiss();
  };

}]);