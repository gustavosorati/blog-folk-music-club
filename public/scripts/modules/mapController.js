export default function mapController() {
  var mymap = L.map('mapid').setView([-20.7173024, -47.8864256], 15);
  var marker = L.marker([-20.7165495, -47.8838675]).addTo(mymap);
  marker.bindPopup('<b>Hello world!</b><br>I am a popup.');

  L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicHJpbmNlc3Npc2xvc3QiLCJhIjoiY2trZ2N3ajQ1MDRmYjJ3czcwenlhN3E0NyJ9.cMZQJfQhKvTxBA4ybIgdBw',
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'your.mapbox.access.token',
    },
  ).addTo(mymap);
}
