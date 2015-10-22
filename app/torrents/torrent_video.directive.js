(function(){
  'use strict';

  angular
    .module('app.torrents')
    .directive('mdbTorrentVideo', mdbTorrentVideo);

  mdbTorrentVideo.$inject = ['$window', '$log', 'API_SETTINGS'];

  function mdbTorrentVideo($window, $log, API_SETTINGS) {
    var directive = {
      restrict: 'E',
      link: link,
      scope: {
        source: "=",
        backdrop: "="
      },
      replace: true,
      templateUrl: 'torrents/torrent_video.directive.html'
    };

    function link(scope, element, attrs) {
      scope.poster = API_SETTINGS.baseImageUrl + 'w1920' + scope.backdrop;

      attrs.type = attrs.type || "video/mp4";

      var setup = {
        'techOrder' : ['html5', 'flash'],
        'controls' : true,
        'preload' : 'none',
        'autoplay': false,
        'poster': scope.poster
      };

      $window.videojs(element[0], setup, function(){
        this.src({type : attrs.type, src: scope.source });
      });

    }

    return directive;
  }

})();