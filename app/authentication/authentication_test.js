describe('app.login module', function() {

  beforeEach(module('app.login'));

  describe('authentication controller', function(){

    it('should be defined', inject(function($controller) {
      var view1Ctrl = $controller('AuthenticationController');
      expect(view1Ctrl).toBeDefined();
    }));

  });
});