
mapboxgl.accessToken = 'pk.eyJ1IjoiamVubmFlcHN0ZWluIiwiYSI6ImNsMmdyc3Z5dzA2ejAzanNiM2kyOXIybjIifQ.3RHeQ3NfuMvjr_CHVV88yg';

const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/light-v10',
center: [ -106.4850,31.7619], 
zoom: 12
});
 
 
//function filterBy(PCI_2018) {
//const filters = ['<=', 'PCI_2018', PCI_2018];
//map.setFilter('PCI2018_mb', filters);

//}
 
map.on('load', () => {
  let filterScore = ['<=', ['number', ['get', 'PCI_2018']], 20];
 
// Add a new layer to visualize the hexbins.
map.addLayer({
  'id': 'equity',
  'type': 'fill',
  'source': {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/jennaepstein/ElPaso_RoadPrioritizationSystem_App/main/App/allHex_mb.geojson'
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
 


map.addLayer({
  'id': 'PCI2018_mb',
  'type': 'line',
  'source': {
    type: 'geojson',
    data:'https://raw.githubusercontent.com/jennaepstein/ElPaso_RoadPrioritizationSystem_App/main/App/PCI2018_mb.geojson'
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

// update score filter when slider is dragged
  document.getElementById('slider').addEventListener('input', (e) => {
    const PCI = parseInt(e.target.value);
    // update the map
    filterScore = ['<=', ['number', ['get', 'PCI_2018']], PCI];
    map.setFilter('PCI2018_mb', ['<=', ['number', ['get', 'PCI_2018']], PCI]);


    // update text in the UI
    document.getElementById(PCI).innerText;
  

    });



  })