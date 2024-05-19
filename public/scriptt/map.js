console.log(mapToken);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: [76.4013, 29.123], // starting position [lng, lat]
  zoom: 9, // starting zoom
});
