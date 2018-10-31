//first import the mapbox access token from the local env, saved in the config.js file
var mapbox_access_token = config.MAPBOX_ACCESS_TOKEN;

// create a map instance
var mymap = L.map('mapid').setView([31.8299292,34.9280298], 8);

// add layer to map
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: mapbox_access_token
}).addTo(mymap);

var popup = L.popup();

function onMapClick(e) {
  popup
    .setLatLng(e.latlng)
    .setContent("לחצת על המפה ב: <br>" + e.latlng.lat + ",<br> "+ e.latlng.lng)
    .openOn(mymap);
    console.log(e.latlng);
}

mymap.on('click', onMapClick);

$("a#spreadsheetUrl").attr("href",config.GOOGLE_SPREADSHEET_URL).attr("target","_blank");

$(document).ready(function (e){
  var jqxhr = $.ajax({                             // call the google spreadsheet to get markers
    url: "https://sheets.googleapis.com/v4/spreadsheets/1ucX1MKPmvVbset9evcUCJ8q-Dh_DucMxmhLz76I9kHI/values/stories?key="+config.GOOGLE_SPREADSHEET_API,
    method: "GET",
    dataType: "json",
    success:
      function(e) {
        var markers = e.values.slice(1); // ignore the headers
        for (var i=0; i<=markers.length-1; i++) {
          var marker = L.marker([markers[i][1],markers[i][0]]).addTo(mymap).bindPopup("<b>הסיפור: </b>"+markers[i][2]);
          marker.openPopup();
        }
      }
  });
});
