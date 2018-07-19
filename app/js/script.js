function AppViewModel() {
  var that = this;
  this.filterOptions = ko.observable("");
  this.markers = [] // empty array created to store all the markers for the desired locations

  // function to initiate map in the map area
  this.mapInit = function () {
    // mapDetails for the basic setting of the map
    var mapDetails = {
      center: new google.maps.LatLng(28.5273, 77.1515),
      zoom: 13,
      styles: styles, // styles from data.js file
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER
      },
      zoomControl: true,
      zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER }
    }
    // creating map in the doc with above map settings and targeting map id in the HTML DOC
    var map = new google.maps.Map(document.getElementById('map'), mapDetails);

    this.infoWindow = new google.maps.InfoWindow();   // creating info window for markers using google API

    for (var i = 0; i < locations.length; i++) { // for loops on the locations array containing marker information
      this.markerTitle = locations[i].title;
      this.markerLatitude = locations[i].latitude;
      this.markerLongitude = locations[i].longitude;
      this.markerType = locations[i].type;

      this.marker = new google.maps.Marker({
        map,
        position: {
          lat: this.markerLatitude,
          lng: this.markerLongitude
        },
        title: this.markerTitle,
        lat: this.markerLatitude,
        lng: this.markerLongitude,
        animation: google.maps.Animation.DROP //https://developers.google.com/maps/documentation/javascript/examples/marker-animations
      });
      this.markers.push(this.marker); // storing all the markers in the this.markers array
      this.marker.addListener("click", that.popAndBounce); // adding function click for each marker
    }
  };

  // function created to pop the window up with location information
  this.populateInfoWindow = function (marker, infoWindow) {
    if (infoWindow.marker != marker) {
      infoWindow.setContent('');
      infoWindow.marker = marker;
      var CLIENT_ID = "4YE2SWVUWIBNRX55TLKO3OQHOIKNQGA20XMGAOEAYB1NH515"; // clientID from FourSqaure
      var CLIENT_SECRET = "AFLJ0MYEWLX5UTRY4JFLI1YG33B2FSK3ELSWRLHOBNK5WFUD"; // clientSecret from FourSqaure
      // reference: https://stackoverflow.com/questions/3066586/get-string-in-yyyymmdd-format-from-js-date-object
      var reqDateFormat = new Date().toISOString().substring(0, 10).replace(/-/g, ''); // for api version from FourSquare
      // reference: https://developer.foursquare.com/docs/api/configuration/versioning
      var fsURL = "https://api.foursquare.com/v2/venues/search?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&ll=" + marker.lat + "," + marker.lng + "&query=" + marker.title.replace(/ /g, '') + "&v=" + reqDateFormat;
      $.getJSON(fsURL).done(function (marker) {
        var response = marker.response.venues[0];
        that.name = response.name;
        that.street = response.location.formattedAddress[0];
        that.city = response.location.formattedAddress[1] || "New Delhi"; // use default in case of non-availability
        that.country = response.location.formattedAddress[3] || "India"; // use default in case of non-availability
        that.category = response.categories[0].name;
        that.windowContent =
          "<h5>" + that.name + "</h5>" +
          "<p> Address: " + that.street + "</p>" +
          "<p>" + that.city + "</p>" +
          "<p>" + that.country + "</p>";
        infoWindow.setContent(that.windowContent);
      }).fail(function () { alert("Opps, some issue with required Web API. Please refresh the page.") })
      infoWindow.open(map, marker);
    }
  };
  // function created for bounce animaton and included populateInfoWindow
  this.popAndBounce = function () {
    that.populateInfoWindow(this, that.infoWindow);
    this.setAnimation(google.maps.Animation.BOUNCE)
    setTimeout((function () {
      this.setAnimation(null);
    }).bind(this), 1450)
  };

  this.mapInit();   // intiating the map function

  this.locationsSearch = ko.computed(function () {
    var searchResult = [];
    for (var i = 0; i < this.markers.length; i++) {
      var searchLocation = this.markers[i];
      if (searchLocation.title.toLowerCase().includes(this.filterOptions().toLowerCase())) {
        searchResult.push(searchLocation);
        this.markers[i].setVisible(true);
      }  // https://stackoverflow.com/questions/38536554/do-i-need-a-last-else-clause-in-an-if-else-if-statement
    }
    return searchResult; // returning the search result
  }, this);
}

function appInit() { ko.applyBindings(new AppViewModel()); }