function DirectionHelper(id)
{

  var rendererOptions, chicago, mapOptions;
  this.directionsDisplay = null;
  this.id = id;
  this.map = null;
  this.directionsService = new google.maps.DirectionsService();

  rendererOptions = {
    draggable: true,
    panel:     document.getElementById('directions_panel' + this.id)
  };
  this.directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);

  chicago = new google.maps.LatLng(41.850033, -87.6500523);
  
  mapOptions = {
    zoom: 6,
    center: chicago,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  this.map = new google.maps.Map(document.getElementById("map_"+this.id), mapOptions);
  this.directionsDisplay.setMap(this.map);
}
DirectionHelper.prototype.calcRoute = function(start, end, waypoints){
  var request, 
      self = this;
  request = {
    origin: start, // an address or LatLng
    destination: end, // an address or a LatLng
    travelMode: google.maps.TravelMode.DRIVING
  };
  console.log(request)
  this.directionsService.route(request,function(r,s){ console.log('shit') })
  this.directionsService.route(request, function(response, status) {
    var theRoute, summaryPanel;
    if (status == google.maps.DirectionsStatus.OK) {
      self.directionsDisplay.setDirections(response);
      
      theRoute = response.routes[0];
      summaryPanel = document.getElementById("directions_panel" + self.id);

      summaryPanel.innerHTML = "";
      // For each route, display summary information.
      for (var i = 0; i < theRoute.legs.length; i++) {
        var routeSegment = i+1;
        summaryPanel.innerHTML += "<b>Route Segment: " + routeSegment + "</b><br />";
        summaryPanel.innerHTML += theRoute.legs[i].start_address + " to ";
        summaryPanel.innerHTML += theRoute.legs[i].end_address + "<br />";
        summaryPanel.innerHTML += theRoute.legs[i].distance.text + "<br />";
        summaryPanel.innerHTML += theRoute.legs[i].duration.text + "<br /><br />";
      }
    }
    
    if(status == google.maps.DirectionsStatus.ZERO_RESULTS){
      alert("Error: One or more of your addresses was not found. If you think this is an error with our website, please contact us.");
    }
    if(status == google.maps.DirectionsStatus.MAX_WAYPOINTS_EXCEEDED){
      alert("Error: You have included more than eight stops along the way. Please use only eight or fewer stops, and try again.");
    }
    if(status == google.maps.DirectionsStatus.INVALID_REQUEST){
      alert("Error: You may be missing a starting or ending point, or you may have included two starting points or two ending points: one in the dropdown menu and one in the entry box. Please edit your map and try again.");
    }
    if(status == google.maps.DirectionsStatus.NOT_FOUND){
      alert("Error: One or more of your addresses was not found. If you think this is an error with our website, please contact us.");
    }
    if(status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT){
      alert("We're sorry! This is an internal error with Go See Campus. Please contact us so we can resolve it.");
    }
    if(status == google.maps.DirectionsStatus.UNKNOWN_ERROR){
      alert("Error: Something went wrong when you loaded this page. Try loading the page again. You may need to log out, clear your temporary files, and log back in.");
    }
  });
};

function initialize() {  
  var dirHelper = null;
  for(var i=1; i<6; i++){
    dirHelper = new DirectionHelper(i);
    dirHelper.calcRoute(document.getElementById('start_'+i).value, document.getElementById('end_'+i).value);
    
  }
}
google.maps.event.addDomListener(window, 'load', initialize);
