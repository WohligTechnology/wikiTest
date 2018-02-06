angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {})

.controller('PlaylistsCtrl', function ($scope, $timeout) {
  $timeout(function () {
    var World = {
      loaded: false,

      init: function initFn() {
        this.createOverlays();
      },

      createOverlays: function createOverlaysFn() {
        /*
        	First an AR.ImageTracker needs to be created in order to start the recognition engine. It is initialized with a AR.TargetCollectionResource specific to the target collection that should be used. Optional parameters are passed as object in the last argument. In this case a callback function for the onTargetsLoaded trigger is set. Once the tracker loaded all its target images, the function worldLoaded() is called.
        	Important: If you replace the tracker file with your own, make sure to change the target name accordingly.
        	Use a specific target name to respond only to a certain target or use a wildcard to respond to any or a certain group of targets.
        */
        this.targetCollectionResource = new AR.TargetCollectionResource("../img/magazine.wtc", {});

        this.tracker = new AR.ImageTracker(this.targetCollectionResource, {
          onTargetsLoaded: this.worldLoaded,
          onError: function (errorMessage) {
            alert(errorMessage);
          }
        });

        /*
        	The next step is to create the augmentation. In this example an image resource is created and passed to the AR.ImageDrawable. A drawable is a visual component that can be connected to an IR target (AR.ImageTrackable) or a geolocated object (AR.GeoObject). The AR.ImageDrawable is initialized by the image and its size. Optional parameters allow for position it relative to the recognized target.
        */

        /* Create overlay for page one */
        var imgOne = new AR.ImageResource("../img/imageOne.png");
        var overlayOne = new AR.ImageDrawable(imgOne, 1, {
          translate: {
            x: -0.15
          }

        });

        /*
        	The last line combines everything by creating an AR.ImageTrackable with the previously created tracker, the name of the image target and the drawable that should augment the recognized image.
        	Please note that in this case the target name is a wildcard. Wildcards can be used to respond to any target defined in the target collection. If you want to respond to a certain target only for a particular AR.ImageTrackable simply provide the target name as specified in the target collection.
        */
        var pageOne = new AR.ImageTrackable(this.tracker, "*", {
          drawables: {
            cam: overlayOne
          },
          onImageRecognized: this.removeLoadingBar,
          onError: function (errorMessage) {
            alert(errorMessage);
          }
        });
      },

      removeLoadingBar: function () {
        if (!World.loaded) {
          var e = document.getElementById('loadingMessage');
          e.parentElement.removeChild(e);
          World.loaded = true;
        }
      },

      worldLoaded: function worldLoadedFn() {
        var cssDivLeft = " style='display: table-cell;vertical-align: middle; text-align: right; width: 50%; padding-right: 15px;'";
        var cssDivRight = " style='display: table-cell;vertical-align: middle; text-align: left;'";
        document.getElementById('loadingMessage').innerHTML =
          "<div" + cssDivLeft + ">Scan Target &#35;1 (surfer):</div>" +
          "<div" + cssDivRight + "><img src='../img/surfer.png'></img></div>";
      }
    };

    World.init();

    //     function Marker(poiData) {

    //     /*
    //         For creating the marker a new object AR.GeoObject will be created at the specified geolocation. An AR.GeoObject connects one or more AR.GeoLocations with multiple AR.Drawables. The AR.Drawables can be defined for multiple targets. A target can be the camera, the radar or a direction indicator. Both the radar and direction indicators will be covered in more detail in later examples.
    //     */

    //     this.poiData = poiData;

    //     var markerLocation = new AR.GeoLocation(poiData.latitude, poiData.longitude, poiData.altitude);

    //     /*
    //         There are two major points that need to be considered while drawing multiple AR.Drawables at the same location. It has to be defined which one is before or behind another drawable (rendering order) and if they need a location offset. For both scenarios, ARchitect has some functionality to adjust the drawable behavior.
    //         To position the AR.Label in front of the background, the background drawable(AR.ImageDrawable) receives a zOrder of 0. Both labels have a zOrder of 1. This way it is guaranteed that the labels will be drawn in front of the background drawable.
    //         Assuming both labels will be drawn on the same geolocation connected with the same AR.GeoObject they will overlap. To adjust their position change the offsetX and offsetY property of an AR.Drawable object. The unit for offsets are SDUs. For more information about SDUs look up the code reference or the online documentation.
    //         In the following both AR.Labels are initialized and positioned. Note that they are added to the cam property of the AR.GeoObject the same way as an AR.ImageDrawable.
    //     */
    //     this.markerDrawable_idle = new AR.ImageDrawable(World.markerDrawable_idle, 2.5, {
    //         zOrder: 0,
    //         opacity: 1.0
    //     });

    //     this.titleLabel = new AR.Label(poiData.title.trunc(10), 1, {
    //         zOrder: 1,
    //         translate: {
    //             y: 0.55
    //         },
    //         style: {
    //             textColor: '#FFFFFF',
    //             fontStyle: AR.CONST.FONT_STYLE.BOLD
    //         }
    //     });

    //     this.descriptionLabel = new AR.Label(poiData.description.trunc(15), 0.8, {
    //         zOrder: 1,
    //         translate: {
    //             y: -0.55
    //         },
    //         style: {
    //             textColor: '#FFFFFF'
    //         }
    //     });

    //     // Changed: 
    //     this.markerObject = new AR.GeoObject(markerLocation, {
    //         drawables: {
    //             cam: [this.markerDrawable_idle, this.titleLabel, this.descriptionLabel]
    //         }
    //     });

    //     return this;
    // }

    // // will truncate all strings longer than given max-length "n". e.g. "foobar".trunc(3) -> "foo..."
    // String.prototype.trunc = function(n) {
    //     return this.substr(0, n - 1) + (this.length > n ? '...' : '');
    // };
    //     var World = {
    //       // true once data was fetched
    //       initiallyLoadedData: false,

    //       // POI-Marker asset
    //       markerDrawable_idle: null,

    //       // called to inject new POI data
    //       loadPoisFromJsonData: function loadPoisFromJsonDataFn(poiData) {

    //         /*
    //         	The example Image Recognition already explained how images are loaded and displayed in the augmented reality view. This sample loads an AR.ImageResource when the World variable was defined. It will be reused for each marker that we will create afterwards.
    //         */
    //         World.markerDrawable_idle = new AR.ImageResource("assets/marker_idle.png");

    //         /*
    //         	Since there are additional changes concerning the marker it makes sense to extract the code to a separate Marker class (see marker.js). Parts of the code are moved from loadPoisFromJsonData to the Marker-class: the creation of the AR.GeoLocation, the creation of the AR.ImageDrawable and the creation of the AR.GeoObject. Then instantiate the Marker in the function loadPoisFromJsonData:
    //         */
    //         var marker = new Marker(poiData);

    //         // Updates status message as a user feedback that everything was loaded properly.
    //         World.updateStatusMessage('1 place loaded');
    //       },

    //       // updates status message shown in small "i"-button aligned bottom center
    //       updateStatusMessage: function updateStatusMessageFn(message, isWarning) {

    //         var themeToUse = isWarning ? "e" : "c";
    //         var iconToUse = isWarning ? "alert" : "info";

    //         $("#status-message").html(message);
    //         $("#popupInfoButton").buttonMarkup({
    //           theme: themeToUse
    //         });
    //         $("#popupInfoButton").buttonMarkup({
    //           icon: iconToUse
    //         });
    //       },

    //       // location updates, fired every time you call architectView.setLocation() in native environment
    //       locationChanged: function locationChangedFn(lat, lon, alt, acc) {

    //         /*
    //         	The custom function World.onLocationChanged checks with the flag World.initiallyLoadedData if the function was already called. With the first call of World.onLocationChanged an object that contains geo information will be created which will be later used to create a marker using the World.loadPoisFromJsonData function.
    //         */
    //         if (!World.initiallyLoadedData) {
    //           // creates a poi object with a random location near the user's location
    //           var poiData = {
    //             "id": 1,
    //             "longitude": (lon + (Math.random() / 5 - 0.1)),
    //             "latitude": (lat + (Math.random() / 5 - 0.1)),
    //             "altitude": 100.0,
    //             "description": "This is the description of POI#1",
    //             "title": "POI#1"
    //           };

    //           World.loadPoisFromJsonData(poiData);
    //           World.initiallyLoadedData = true;
    //         }
    //       },
    //     };

    //     /* 
    //     	Set a custom function where location changes are forwarded to. There is also a possibility to set AR.context.onLocationChanged to null. In this case the function will not be called anymore and no further location updates will be received. 
    //     */
    //     AR.context.onLocationChanged = World.locationChanged;
  }, 100);

});
