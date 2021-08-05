function createMap(earthquakes) {

  //make a lightmap layer
  var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
  });

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
      "Light Map": lightmap
  };

  //create an overlay layer to hold earthquake data
  var overlayMaps = {
      "Earthquakes": earthquakes
  };

  // Create the map object with options
  var myMap = L.map("mapid", {
      center: [19.89, 155.58],
      zoom: 2,
      layers: [lightmap, earthquakes]
  });

  //create a control layer 
  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
      }).addTo(myMap);

};

function createMarkers(response) {
  // make a variable to contain the data 
  var data = response.features
  console.log(data)
  // Initialize an array to hold bike markers
  var quakeMarkers = [];

  // Loop through the stations array
  for (var i=0; i < data.length; i++) {
      var geometry = data[i].geometry.coordinates
      var lon = geometry[0]
      console.log(lon)
      var lat = geometry[1]
      var depth = geometry[3]
      var placeName = data[i].properties.place
      var mag = data[i].properties.mag
      console.log(mag)

    // For each station, create a marker and bind a popup with the station's name
    quakeMarkers.push(L.circle(lat, lon, {
      fillOpacity: .75,
      color: "white",
      fillColor: "purple",
      radius: createMarkers(mag)
      .bindPopup("<h3>" + placeName + "</h3> <hr> <h3>Depth: " + depth + "</h3>").addTo(myMap)
    }));
    // Add the marker to the quakeMarkers array
    quakeMarkers.push(quakeMarker);
  }

  // Create a layer group made from the bike markers array, pass it into the createMap function
  createMap(L.layerGroup(quakeMarkers));
}


// Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson", createMarkers);