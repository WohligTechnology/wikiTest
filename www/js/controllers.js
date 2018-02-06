angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {})

.controller('PlaylistsCtrl', function ($scope, $timeout) {
  $timeout(function () {

    function Marker(poiData) {

    /*
        For creating the marker a new object AR.GeoObject will be created at the specified geolocation. An AR.GeoObject connects one or more AR.GeoLocations with multiple AR.Drawables. The AR.Drawables can be defined for multiple targets. A target can be the camera, the radar or a direction indicator. Both the radar and direction indicators will be covered in more detail in later examples.
    */

    this.poiData = poiData;

    var markerLocation = new AR.GeoLocation(poiData.latitude, poiData.longitude, poiData.altitude);

    /*
        There are two major points that need to be considered while drawing multiple AR.Drawables at the same location. It has to be defined which one is before or behind another drawable (rendering order) and if they need a location offset. For both scenarios, ARchitect has some functionality to adjust the drawable behavior.
        To position the AR.Label in front of the background, the background drawable(AR.ImageDrawable) receives a zOrder of 0. Both labels have a zOrder of 1. This way it is guaranteed that the labels will be drawn in front of the background drawable.
        Assuming both labels will be drawn on the same geolocation connected with the same AR.GeoObject they will overlap. To adjust their position change the offsetX and offsetY property of an AR.Drawable object. The unit for offsets are SDUs. For more information about SDUs look up the code reference or the online documentation.
        In the following both AR.Labels are initialized and positioned. Note that they are added to the cam property of the AR.GeoObject the same way as an AR.ImageDrawable.
    */
    this.markerDrawable_idle = new AR.ImageDrawable(World.markerDrawable_idle, 2.5, {
        zOrder: 0,
        opacity: 1.0
    });

    this.titleLabel = new AR.Label(poiData.title.trunc(10), 1, {
        zOrder: 1,
        translate: {
            y: 0.55
        },
        style: {
            textColor: '#FFFFFF',
            fontStyle: AR.CONST.FONT_STYLE.BOLD
        }
    });

    this.descriptionLabel = new AR.Label(poiData.description.trunc(15), 0.8, {
        zOrder: 1,
        translate: {
            y: -0.55
        },
        style: {
            textColor: '#FFFFFF'
        }
    });

    // Changed: 
    this.markerObject = new AR.GeoObject(markerLocation, {
        drawables: {
            cam: [this.markerDrawable_idle, this.titleLabel, this.descriptionLabel]
        }
    });

    return this;
}

// will truncate all strings longer than given max-length "n". e.g. "foobar".trunc(3) -> "foo..."
String.prototype.trunc = function(n) {
    return this.substr(0, n - 1) + (this.length > n ? '...' : '');
};
    var World = {
      // true once data was fetched
      initiallyLoadedData: false,

      // POI-Marker asset
      markerDrawable_idle: null,

      // called to inject new POI data
      loadPoisFromJsonData: function loadPoisFromJsonDataFn(poiData) {

        /*
        	The example Image Recognition already explained how images are loaded and displayed in the augmented reality view. This sample loads an AR.ImageResource when the World variable was defined. It will be reused for each marker that we will create afterwards.
        */
        World.markerDrawable_idle = new AR.ImageResource("assets/marker_idle.png");

        /*
        	Since there are additional changes concerning the marker it makes sense to extract the code to a separate Marker class (see marker.js). Parts of the code are moved from loadPoisFromJsonData to the Marker-class: the creation of the AR.GeoLocation, the creation of the AR.ImageDrawable and the creation of the AR.GeoObject. Then instantiate the Marker in the function loadPoisFromJsonData:
        */
        var marker = new Marker(poiData);

        // Updates status message as a user feedback that everything was loaded properly.
        World.updateStatusMessage('1 place loaded');
      },

      // updates status message shown in small "i"-button aligned bottom center
      updateStatusMessage: function updateStatusMessageFn(message, isWarning) {

        var themeToUse = isWarning ? "e" : "c";
        var iconToUse = isWarning ? "alert" : "info";

        // $("#status-message").html(message);
        $("#popupInfoButton").buttonMarkup({
          theme: themeToUse
        });
        $("#popupInfoButton").buttonMarkup({
          icon: iconToUse
        });
      },

      // location updates, fired every time you call architectView.setLocation() in native environment
      locationChanged: function locationChangedFn(lat, lon, alt, acc) {

        /*
        	The custom function World.onLocationChanged checks with the flag World.initiallyLoadedData if the function was already called. With the first call of World.onLocationChanged an object that contains geo information will be created which will be later used to create a marker using the World.loadPoisFromJsonData function.
        */
        if (!World.initiallyLoadedData) {
          // creates a poi object with a random location near the user's location
          var poiData = {
            "id": 1,
            "longitude": (lon + (Math.random() / 5 - 0.1)),
            "latitude": (lat + (Math.random() / 5 - 0.1)),
            "altitude": 100.0,
            "description": "This is the description of POI#1",
            "title": "POI#1"
          };

          World.loadPoisFromJsonData(poiData);
          World.initiallyLoadedData = true;
        }
      },
    };

    /* 
    	Set a custom function where location changes are forwarded to. There is also a possibility to set AR.context.onLocationChanged to null. In this case the function will not be called anymore and no further location updates will be received. 
    */
    AR.context.onLocationChanged = World.locationChanged;
  }, 100);

});
