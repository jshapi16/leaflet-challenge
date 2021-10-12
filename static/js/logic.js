var lightmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

// Create a baseMaps object
var baseMaps = {
  "Light Map": lightmap,
  "Dark Map": darkmap
};

  var myMap = L.map("mapid", {
      fullscreenControl: true,
      center: [19.89, 155.58],
      zoom: 3,
      layers: [lightmap]
  });

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data => {
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
  },
  style: getStyle,
  onEachFeature: function(feature, layer) {
    layer.bindPopup("<h3>Name:" + " " + feature.properties.place + "</h3> <hr> <h3>Depth: " + feature.geometry.coordinates[2] + "</h3>" 
                    + "<h3> Magnitude: " +feature.properties.mag + "</h3>");
  }
  }).addTo(myMap);
  
  //this is my legend
  var legend = L.control({
    position: "topright"
  });


  legend.onAdd = function(){
    var div = L.DomUtil.create("div", "legend");
    var grades = ["default", -10, 10, 30, 50, 90];
    var colors = ["black", "#5bc489", "#008d8c", "#007f86", "#1c6373", "#2a4858"];
    for (var i=0; i < grades.length; i++) {
      div.innerHTML += "<i style = 'background: "
      + colors[i] 
      + "'></i>"
      + grades[i]
      + (grades[i + 1] ? "&ndash;"
      + grades[i + 1]
      + "<br>" : "+");
    }
    return div;
  };
  legend.addTo(myMap);

});

// or, add to an existing map:
map.addControl(new L.Control.Fullscreen());


function getStyle(feature) {
  return {
    fillOpacity: .8,
    color: "white",
    stroke: true,
    weight: 1.5,
    fillColor: getColor(feature.geometry.coordinates[2]),
    radius: getRadius(feature.properties.mag)
  }
};

function getColor(depth) {
  switch(true) {
    case depth >= 90:
      return "#2a4858";
      break;
    case depth >= 50:
      return "#1c6373";
      break;
    case depth >= 30:
      return "#007f86";
      break;
    case depth >= 10:
      return "#008d8c";
      break;
    case depth >= -10:
      return "#5bc489";
      break;
    default: 
      return "black";
  }
};

function getRadius(magnitude) {
  return magnitude * 2;
};