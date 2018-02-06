angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {})

.controller('PlaylistsCtrl', function ($scope, $timeout) {
  $timeout(function () {
    var demo = {
      requiredFeatures: ["2d_tracking", "geo"],
      isDeviceSupported: false,
      startupConfiguration: {
        "camera_position": "back"
      },
      onDeviceReady: function () {
        demo.wikitudePlugin.isDeviceSupported(demo.onDeviceSupported, demo.onDeviceNotSupported, demo.requiredFeatures);
      },
      onDeviceSupported: function () {
        demo.wikitudePlugin.loadARchitectWorld(
          app.onARExperienceLoadedSuccessful,
          app.onARExperienceLoadError,
          app.arExperienceUrl,
          app.requiredFeatures,
          app.startupConfiguration
        );
      },
      onARExperienceLoadedSuccessful: function (loadedURL) {
        console.log('onARExperienceLoadedSuccessful');
        demo.wikitudePlugin.callJavaScript('createCircle(new AR.RelativeLocation(null, -10, 0), \'#97FF18\');');
      },
      onARExperienceLoadError: function (errorMessage) {
        console.log("onARExperienceLoadError");
      }
    };
  }, 100);

});
