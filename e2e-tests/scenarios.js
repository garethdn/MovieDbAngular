/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {
  browser.get('index.html');

  it('should automatically redirect to /login when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/login");
  });

  describe('view1', function() {
    beforeEach(function() {
      browser.get('index.html#/login');
    });

    it('should render the login view when user navigates to /login', function() {
      expect(element.all(by.css('[ng-view] h1')).first().getText()).
        toMatch(/The Movie DB App/);
    });
  });
});
