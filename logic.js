var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"
d3.json(queryUrl, function(data) {
  createFeatures(data.features);
});

function magnitudeColor(m) {
  return m >=10 ? "Black":
         m >= 9 ? "Maroon":
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
        radius: feature.properties.mag*(0.5*feature.properties.mag),
        fillColor: magnitudeColor(feature.properties.mag),
        color: "Black",
        weight: 0.25,
        fillOpacity: 0.4 + feature.properties.mag*0.05
      });
      circle.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>"  +  
      "Magnitude: " + feature.properties.mag);
      return circle;
    }
  });
  createMap(earthquakes);
}

function createMap(earthquakes) {

  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2Z3MzIyIiwiYSI6ImNqaTJhMGt2bjAwaWEzcG93emdmOGVuc24ifQ.rfs8p7OswZGgn4C-P04WUA")
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2Z3MzIyIiwiYSI6ImNqaTJhMGt2bjAwaWEzcG93emdmOGVuc24ifQ.rfs8p7OswZGgn4C-P04WUA");
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2Z3MzIyIiwiYSI6ImNqaTJhMGt2bjAwaWEzcG93emdmOGVuc24ifQ.rfs8p7OswZGgn4C-P04WUA");

  var baseMaps = {
    "Satellite": satellite,
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
    center: [
      0,0
    ],
    zoom: 2.5,
    layers: [satellite, earthquakes]
  });

  
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {
  
      var div = L.DomUtil.create('map', 'info legend'),
          magn = [0,1,2,3,4,5,6,7,8,9,10],
          labels = [];
      for (var i = 0; i < magn.length; i++) {
          div.innerHTML += '<i style="background:' + magnitudeColor(magn[i]) + '"></i> ' + magn[i] + (magn[i + 1] ? '<br>' : '+');
      }
  
      return div;
  };
  legend.addTo(myMap);

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
