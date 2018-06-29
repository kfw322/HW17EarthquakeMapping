var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"
d3.json(queryUrl, function(data) {
  createFeatures(data.features);
});

function magnitudeColor(m) {
  return m >= 9 ? "Maroon":
         m >= 8 ? "MediumVioletRed":
         m >= 7 ? "Red":
         m >= 6 ? "OrangeRed":
         m >= 5 ? "Orange":
         m >= 4 ? "Gold":
         m >= 3 ? "Chartreuse":
         m >= 2 ? "PaleGreen":
         m >= 1 ? "PowderBlue":
                  "WhiteSmoke";}
function createFeatures(earthquakeData) {
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer : function (feature, latlng){
      var circle = L.circleMarker(latlng, {
        radius: 2* feature.properties.mag,
        fillColor: magnitudeColor(feature.properties.mag),
        color: "Black",
        weight: 0.5,
        fillOpacity: 0.5
      });
      circle.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>"  +  
      "Magnitude: " + feature.properties.mag);
      return circle;
    }
  });
  createMap(earthquakes);
  
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (earthquakes) {
  
      var div = L.DomUtil.create('map', 'info legend'),
          grades = [0,1,2,3,4,5,6,7,8,9,10],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + magnitudeColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
  
  legend.addTo(earthquakes);
}



function createMap(earthquakes) {

  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2Z3MzIyIiwiYSI6ImNqaTJhMGt2bjAwaWEzcG93emdmOGVuc24ifQ.rfs8p7OswZGgn4C-P04WUA")

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2Z3MzIyIiwiYSI6ImNqaTJhMGt2bjAwaWEzcG93emdmOGVuc24ifQ.rfs8p7OswZGgn4C-P04WUA");

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1Ijoia2Z3MzIyIiwiYSI6ImNqaTJhMGt2bjAwaWEzcG93emdmOGVuc24ifQ.rfs8p7OswZGgn4C-P04WUA");

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite": satellite,
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [satellite, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
