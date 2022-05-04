
mapboxgl.accessToken = 'pk.eyJ1IjoiamVubmFlcHN0ZWluIiwiYSI6ImNsMmdyc3Z5dzA2ejAzanNiM2kyOXIybjIifQ.3RHeQ3NfuMvjr_CHVV88yg';

const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/light-v10',
center: [ -106.4850,31.7619], 
zoom: 12
});
 

map.addControl(new mapboxgl.NavigationControl());
//map.addControl(new mapboxgl.FullscreenControl());

const rtoggle = 'equity' // It's the checked radio selection
// add navigational control


// define variables
const layerList = document.getElementById('menu');
const inputs = layerList.getElementsByTagName('input');
const equityLegendEl = document.getElementById('equity-legend');
const congestionLegendEl = document.getElementById('congestion-legend');
const safetyLegendEl = document.getElementById('safety-legend');

// define functions
function switchLayer(layer) {
  let layerId = layer.target.id;
    // set layer id to a menu value
    // If id = equity
       if (layerId == 'equity') {
          map.setLayoutProperty('equity', 'visibility', 'visible');
          map.setLayoutProperty('congestion', 'visibility', 'none');
          map.setLayoutProperty('safety', 'visibility', 'none');
          equityLegendEl.style.display = 'block';
          congestionLegendEl.style.display = 'none';
          safetyLegendEl.style.display = 'none';
        }
        // If id = congestion
       if (layerId == 'congestion') {
         map.setLayoutProperty('equity', 'visibility', 'none');
         map.setLayoutProperty('congestion', 'visibility', 'visible');
         map.setLayoutProperty('safety', 'visibility', 'none');
         equityLegendEl.style.display = 'none';
         congestionLegendEl.style.display = 'block';
         safetyLegendEl.style.display = 'none';
        }
       // Else id = safety
       else {
         map.setLayoutProperty('equity', 'visibility', 'none');
         map.setLayoutProperty('congestion', 'visibility', 'none');
         map.setLayoutProperty('safety', 'visibility', 'visible');
        equityLegendEl.style.display = 'none';
        congestionLegendEl.style.display = 'none';
        safetyLegendEl.style.display = 'block';
       }
}

for (let i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
}



map.on('load', () => {

const popup = new mapboxgl.Popup({ closeOnClick: false })
.setLngLat([-106.4850,31.7619])
.setHTML('<big><h2>Welcome to the El Paso Road Pavement Conditions Explorer!</h2> <p>This tool was created for the Capital Improvements Department, Planning Division by graduate students at the University of Pennsylvania as part of the Masters of Urban Spatial Analytics Practicum. All documentation, data, and reports from the project can be found <a href="https://github.com/sscheng25/Pavement_Repair_Prioritization_System">here.</a></p></big>')
.addTo(map);

let filterScore = ['<=', ['number', ['get', 'PCI_2021']], 40]; // set PCI filter by default on scores 40 or lower

// Add a new layer to visualize the hexbins for EQUITY
 map.addLayer({
  'id': 'equity',
  'type': 'fill',
  'source': {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/jennaepstein/ElPaso_RoadPrioritizationSystem_App/main/App/allHex_mb.geojson'
  },
  'layout': {'visibility': 'visible'},
  
  'paint': {
  // Color bins by total_equity, using a `match` expression.
  'fill-color': [
  'match',
  ['get', 'total_equity'],
  'Very Low Need',
  '#4A7BB7',
  'Low Need',
  '#98CAE1',
  'Moderate Need',
  '#EAECCC',
  'High Need',
  '#FDB366',
  'Highest Need',
  '#A50026',
  /* other */ '#ccc'
  ],
  'fill-opacity': 0.5,
  }
  });
 

  // Add a new layer to visualize the hexbins for CONGESTION (waze jams)
map.addLayer({
  'id': 'congestion',
  'type': 'fill',
  'filter': ['>=', 'waze_count', 0],
  'source': {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/jennaepstein/ElPaso_RoadPrioritizationSystem_App/main/App/allHex_mb.geojson'
  },
  'layout': {'visibility': 'none'},
  'paint': {
    'fill-color': [
    'interpolate',
    ['linear'],
    ['get', 'waze_count'],
    0,
    '#ffffff',
    1,
    '#ffffd4',
    20,
    '#fee391',
    40,
    '#fec44f',
    60,
    '#fe9929',
    80,
    '#d95f0e',
    100,
    '#993404'
    ],
    'fill-opacity': 0.70
    }
  });


  // Add a new layer to visualize the hexbins for SAFETY  (CRASH COUNT)
  map.addLayer({
    'id': 'safety',
    'type': 'fill',
    'filter': ['>=', 'crash_count', 0],
    'source': {
      type: 'geojson',
      data: 'https://raw.githubusercontent.com/jennaepstein/ElPaso_RoadPrioritizationSystem_App/main/App/allHex_mb.geojson'
    
    },
    'layout': {'visibility': 'none'},
    'paint': {
      'fill-color': [
      'interpolate',
      ['linear'],
      ['get', 'crash_count'],
      0,
      '#ffffff',
      1,
      '#eff3ff',
      20,
      '#c6dbef',
      40,
      '#9ecae1',
      60,
      '#6baed6',
      80,
      '#3182bd',
      100,
      '#08519c'
      ],
      'fill-opacity': 0.70
      }
    });


    //add PCI
map.addLayer({
  'id': 'PCI2021_predictions',
  'type': 'line',
  'source': {
    type: 'geojson',
    data:'https://raw.githubusercontent.com/jennaepstein/ElPaso_RoadPrioritizationSystem_App/main/App/PCI2021_predictions.geojson'
  },
  'paint': {
    'line-width': 3,
    'line-color': '#585858'
  },
  'layout': {
  'line-join': 'round',
  'line-cap': 'round'
  },
  'filter': ['all', filterScore]

  
});


//PCI SCORE FILTERING
// update score filter when slider is dragged
  document.getElementById('slider').addEventListener('input', (e) => {
    const PCI = parseInt(e.target.value);
    // update the map
    filterScore = ['<=', ['number', ['get', 'PCI_2021']], PCI];
    map.setFilter('PCI2021_predictions', ['<=', ['number', ['get', 'PCI_2021']], PCI]);


  // Set the label to the score
  document.getElementById('score').textContent = PCI;
  });



  

// When a click event occurs on a feature in the states layer,
// open a popup at the location of the click, with description
// HTML from the click event's properties.


map.on('click', 'PCI2021_predictions', (e) => {
  new mapboxgl.Popup()
  .setLngLat(e.lngLat)
  .setHTML(`<h3>Street Name: ${e.features[0].properties.STREETNAME}</h3><h3>PCI: ${e.features[0].properties.PCI_2021}</h3><h3>Class: ${e.features[0].properties.CLASS}</h3><h3>Plan Area: ${e.features[0].properties.PLANAREA}</h3><h3>District: ${e.features[0].properties.DISTRICT}</h3>`)
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
  });
  



 


    
    

});

