d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson", function(data) {
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  var earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer : function (feature, latlng){
      var circle = L.circleMarker(latlng, {
        radius: feature.properties.mag * 4,
        fillColor: magnitudeColor(feature.properties.mag),
        color: "Black",
        weight: 0.5,
        fillOpacity: 0.5 + feature.properties.mag*0.05
      });
      circle.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p> Magnitude: " + feature.properties.mag);
      return circle;
    }
  });
  createMap(earthquakes);
}
var faultLines = new L.LayerGroup();
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json", function(faults) {
  L.geoJSON(faults, {
    color: "gray",
    fillColor: "black",
    weight: 2
  }).addTo(faultLines);
});

function magnitudeColor(m) {
  return m >=7.0 ? "Indigo":
         m >=6.5 ? "DarkRed":
         m >=6.0 ? "Red":
         m >=5.5 ? "OrangeRed":
         m >=5.0 ? "Tomato":
         m >=4.5 ? "Orange":
         m >=4.0 ? "Gold":
         m >=3.5 ? "Chartreuse":
         m >=3.0 ? "PaleGreen":
         m >=2.5 ? "PowderBlue":
                   "WhiteSmoke";
}

function createMap(earthquakes) {

  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2Z3MzIyIiwiYSI6ImNqaTJhMGt2bjAwaWEzcG93emdmOGVuc24ifQ.rfs8p7OswZGgn4C-P04WUA")
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2Z3MzIyIiwiYSI6ImNqaTJhMGt2bjAwaWEzcG93emdmOGVuc24ifQ.rfs8p7OswZGgn4C-P04WUA");
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2Z3MzIyIiwiYSI6ImNqaTJhMGt2bjAwaWEzcG93emdmOGVuc24ifQ.rfs8p7OswZGgn4C-P04WUA");
  
  var baseMaps = {
    "Satellite": satellite,
    "Street Map": streetmap
  };

  var myMap = L.map("map", {
    tileLayer: {
      continuousWorld: false, 
      noWrap: true
    },
    layers: [satellite, earthquakes]
    
  }).setView([0,0],3);

  var legend = L.control({position: 'topright'});
  legend.onAdd = function (myMap) {
  
      var div = L.DomUtil.create('map', 'info legend'),
          magn = [2.0,2.5,3.0,3.5,4.0,4.5,5.0,5.5,6.0,6.5,7.0],
          labels = [];
      for (var i = 0; i < magn.length; i++) {
          div.innerHTML += '<i style="background:' + magnitudeColor(magn[i]) + '"></i> ' + magn[i] + (magn[i + 1] ? '<br>' : '+');
      }
      return div;
  };
  legend.addTo(myMap);

  var overlayMaps = {
    Earthquakes: earthquakes,
    Faultlines : faultLines
  };

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}
