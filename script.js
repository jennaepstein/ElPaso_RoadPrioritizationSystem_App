mapboxgl.accessToken = 'pk.eyJ1Ijoia2NoYW5nMDg5IiwiYSI6ImNsM2Q1OHpwaDA0czAzaXRsa3pvZHdwZTIifQ.7kwkaMYR7Ie7vs8zJTujNg';
// Set bounds to orange county using http://bboxfinder.com/ 
const bounds = [
  [-119.109924,33.106993],
  [-116.028259,34.498756]
];

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: [-117.9367782, 33.69947],
  zoom: 10,
  maxBounds: bounds // Set the map's geographical boundaries.
});


// Geocoding
map.addControl(
  // eslint-disable-next-line no-undef
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    // Limiting results to state of CA and immediate area
    bbox: [-128.513675,32.445367, -111.251957,42.136987],
    mapboxgl
  })
);

// Add mapbox navigational control, default top right
map.addControl(new mapboxgl.NavigationControl());

// Layer toggle const
/* const rtoggle = 'City'; // This is the checked radio selection for equity

// define variables
const layerList = document.getElementById('menu');
const inputs = layerList.getElementsByTagName('input');
const equityLegendEl = document.getElementById('equity-legend');
const congestionLegendEl = document.getElementById('congestion-legend');
const safetyLegendEl = document.getElementById('safety-legend');
const floodriskLegendEl = document.getElementById('floodrisk-legend');

// Define functions for adjusting visibility of layers - HOW TO CONVERT THIS TO ARROW FUNCTION??
function switchLayer(layer) {
  let layerId = layer.target.id;
  // set layer id to a menu value
  // If id = equity
  if (layerId === 'equity') {
    map.setLayoutProperty('equity', 'visibility', 'visible');
    map.setLayoutProperty('congestion', 'visibility', 'none');
    map.setLayoutProperty('safety', 'visibility', 'none');
    map.setLayoutProperty('floodrisk', 'visibility', 'none');
    equityLegendEl.style.display = 'block';
    congestionLegendEl.style.display = 'none';
    safetyLegendEl.style.display = 'none';
    floodriskLegendEl.style.display = 'none';
  }
  // If id = congestion
  if (layerId === 'congestion') {
    map.setLayoutProperty('equity', 'visibility', 'none');
    map.setLayoutProperty('congestion', 'visibility', 'visible');
    map.setLayoutProperty('safety', 'visibility', 'none');
    map.setLayoutProperty('floodrisk', 'visibility', 'none');
    equityLegendEl.style.display = 'none';
    congestionLegendEl.style.display = 'block';
    safetyLegendEl.style.display = 'none';
    floodriskLegendEl.style.display = 'none';
  }
  // If id = safety
  if (layerId === 'safety') {
    map.setLayoutProperty('equity', 'visibility', 'none');
    map.setLayoutProperty('congestion', 'visibility', 'none');
    map.setLayoutProperty('safety', 'visibility', 'visible');
    map.setLayoutProperty('floodrisk', 'visibility', 'none');
    equityLegendEl.style.display = 'none';
    congestionLegendEl.style.display = 'none';
    safetyLegendEl.style.display = 'block';
    floodriskLegendEl.style.display = 'none';
  // Else id = floodrisk
  } else {
    map.setLayoutProperty('equity', 'visibility', 'none');
    map.setLayoutProperty('congestion', 'visibility', 'none');
    map.setLayoutProperty('safety', 'visibility', 'none');
    map.setLayoutProperty('floodrisk', 'visibility', 'visible');
    equityLegendEl.style.display = 'none';
    congestionLegendEl.style.display = 'none';
    safetyLegendEl.style.display = 'none';
    floodriskLegendEl.style.display = 'block';
  }
}

for (let i = 0; i < inputs.length; i++) {
  inputs[i].onclick = switchLayer;
}*/

// Map load
map.on('load', () => {

  // Add all city data to map on load
  map.addLayer({
    'id': 'City',
    'type': 'fill',
    'source': {
      type: 'geojson',
      data: 'allData.geojson'
    },
    'layout': { 'visibility': 'visible' },
    'paint': {
      'fill-color':'#A50026',
      'fill-opacity': 0.5,
    }
    
  });

  // When a click event occurs on a feature in the  layer,
  // open a popup at the location of the click, with description
  // HTML from the click event's properties.

  /*map.on('click', 'PCI2021_predictions', (e) => {
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`<strong>Street Name: </strong>${e.features[0].properties.STREETNAME}<br><strong>Predicted 2021 PCI: </strong>${e.features[0].properties.PCI_2021}<br><strong>Street Class: </strong>${e.features[0].properties.CLASS}<br><strong>Plan Area: </strong>${e.features[0].properties.PLANAREA}<br><strong>District: </strong>${e.features[0].properties.DISTRICT}`)
      .addTo(map);
  });

  // Change the cursor to a pointer when
  // the mouse is over the states layer.
  map.on('mouseenter', 'PCI2021_predictions', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change the cursor back to a pointer
  // when it leaves the states layer.
  map.on('mouseleave', 'PCI2021_predictions', () => {
    map.getCanvas().style.cursor = '';
  });*/
});

//Table
var tableData = fetch('allData.geojson')

window.onload = function() {
  document.getElementById("jsoncontent").innerHTML = "<tr><th>CBO_Name</th><th>City</th>";

  tableData.features.forEach(function(entry) {
      document.getElementById("jsoncontent").innerHTML += "<tr><td>" + entry.properties.CBO_Name + "</td><td>" + entry.properties.City + "</td></tr>";
  });
};