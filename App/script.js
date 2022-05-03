
mapboxgl.accessToken = 'pk.eyJ1IjoiamVubmFlcHN0ZWluIiwiYSI6ImNsMmdyc3Z5dzA2ejAzanNiM2kyOXIybjIifQ.3RHeQ3NfuMvjr_CHVV88yg';

const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/light-v10',
center: [ -106.4850,31.7619], 
zoom: 12
});
 

map.addControl(new mapboxgl.NavigationControl());
//map.addControl(new mapboxgl.FullscreenControl());


map.on('load', () => {

const popup = new mapboxgl.Popup({ closeOnClick: false })
.setLngLat([-106.4850,31.7619])
.setHTML('<h2>Welcome to the El Paso Road Pavement Conditions Explorer!This tool was created for the Capital Improvements Department, Planning Division by graduate students at the University of Pennsylvania as part of the Masters of Urban Spatial Analytics Practicum. All documentation, data, and reports from the project can be found <a href="https://github.com/sscheng25/Pavement_Repair_Prioritization_System">here.</a></h2>')
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
  'layout' : {
    'visibility': 'visible' // make layer visible by default
  },
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
  'layout' : {
    'visibility': 'none' // make layer not visible by default
  },
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
    'layout' : {
      'visibility': 'none' // make layer not visible by default
    },
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


  // Set the label to the month
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
  

  })

 

// After the last frame rendered before the map enters an "idle" state.
   map.on('idle', () => {
    // If these two layers were not added to the map, abort
    if (!map.getLayer('equity') || !map.getLayer('congestion') || !map.getLayer('safety')) {
        return;
    }



    // Enumerate ids of the layers.
    const toggleableLayerIds = ['equity', 'congestion', 'safety'];

    // Set up the corresponding toggle button for each layer.
    for (const id of toggleableLayerIds) {
        // Skip layers that already have a button set up.
        if (document.getElementById(id)) {
            continue;
        }

        // Create a link.
        const link = document.createElement('a');
        link.id = id;
        link.href = '#';
        link.textContent = id;
        link.className = '';

        // Show or hide layer when the toggle is clicked.
        link.onclick = function (e) {
            const clickedLayer = this.textContent;
            e.preventDefault();
            e.stopPropagation();

            const visibility = map.getLayoutProperty(
                clickedLayer,
                'visibility'
            );

            // Toggle layer visibility by changing the layout object's visibility property.
            if (visibility === 'visible') {
                map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                this.className = '';
            } else {
                this.className = '';
                map.setLayoutProperty(
                    clickedLayer,
                    'visibility',
                    'visible'
                );
            }
        };

        const layers = document.getElementById('menu');
        layers.appendChild(link);

    
    }
    

    /*NEED TO MAKE THE LEGENDS ATTACH TO EACH LAYER AND ONLY SHOW ONE WHEN IS ACTIVE...BUT RIGHT NOW CAN'T ISOLATE ONLY ONE LAYER ACTIVE AT A TIME...*/
const equityLegendEl = document.getElementById('equity-legend');
const congestionLegendEl = document.getElementById('congestion-legend');
//const safetyLegendEl = document.getElementById('safety-legend');
equityLegendEl.appendChild(link);
congestionLegendEl.appendChild(link);
});

