// this file to set the leaflat Map service


//first import the mapbox access token from the local env, saved in the config.js file
var mapbox_access_token = config.MAPBOX_ACCESS_TOKEN;


// create a map instance object
var map = L.map('map');

// add layer to map
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: mapbox_access_token
}).addTo(map);

var popup = L.popup();                               // create a pop-up object


function onLocationFound(e) {               // when map loads, try defining user's locaition and show on map (with radius)
    var radius = e.accuracy / 2;
    L.circle(e.latlng, radius, {color: "red", opacity:.5, fillColor: '#f03'}).addTo(map).bindPopup("אתם נמצאים ברדיוס של "+ radius + " מטרים מהנקודה הזו").openPopup();
    window.position = {}
    window.position.lng = e.latlng.lng;
    window.position.lat = e.latlng.lat;
}

map.on('locationfound', onLocationFound);   // when map is loaded, run onLocationFound if te location is found

function onLocationError(e) {                                      // tell user their location was not found
    alert("האפליקציה לא הצליחה לאתר את המיקום המדוייק שלך");
}

map.on('locationerror', onLocationError);  // when map is loaded, run onLocationError if the location isn't found

var currentLocation = document.getElementById("currentLocationBtn").addEventListener("click",getLocation); // function to run when the main button is clicked

function getLocation(e) {                                // check if the user's geolocation was saved
    if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(addStory);
          $("#addStory").modal('toggle');
    } else {
      alert("האפליקציה לא הצליחה לאתר את המיקום המדוייק שלך");
    }
}


function addStory(message) {            // add story by extracting coords and embdiing in the modal + showing modal
  console.log(message);
  if (typeof(message.coords) == "undefined")   {  // first part handles clicks on the map:
    var lon = message[0];
    var lat = message[1];
  }
  else
  {                                         // in case the main app button was clicked instead of the map
    var lon = message.coords.longitude;
    var lat = message.coords.latitude;
  }
                                      // and now to the common actions on in the modal
    $("#longitude").val(lon);
    $("#latitude").val(lat);
    $("#addStory").modal("toggle");
}

map.on('click', onMapClick);                              // run onMapClick when user clicks the map

function onMapClick(e) {                           // actions to run when map is being clicked
  var lng = e.latlng["lng"];
  var lat =  e.latlng["lat"];
  var position = [lng, lat];
  addStory(position);
}



function objectifyForm(formArray) {//serialize data function

  var returnArray = {};
  for (var i = 0; i < formArray.length; i++){
    returnArray[formArray[i]['name']] = formArray[i]['value'];
  }
  return returnArray;
}

var $form = $('form#storyForm')[0],                             // preapre to thhe ajax call to save markers
    writeUrl = config.GOOGLE_SPREADSHEET_TABLE_URL;

$('#submit').on('click', function(e) {       // ajax call to the google spreadsheet (temporary)
  e.preventDefault();
  var toSave = objectifyForm($form);
  var jqxhr = $.ajax({
    url: writeUrl,
    method: "GET",
    dataType: "json",
    data: toSave,
    success:
    function() {
        alert("הסיפור נשמר!");        // update user the item was saved
        $("#addStory").modal('hide'); // close modal only after saving confimration
        var marker = L.marker([toSave.latitude, toSave.longitude]).addTo(map).bindPopup("<b>הסיפור: </b>"+toSave.storyField); // add manually the new marker to the map
        marker.openPopup(); // show the new marker on the map
        $("#storyField.input").val(""); // clear the form field(s) for the next time
      }
    }
  );
})



$("a#spreadsheetUrl").attr("href",config.GOOGLE_SPREADSHEET_URL).attr("target","_blank");

$(document).ready(function(e){
  var jqxhr = $.ajax({                             // call the google spreadsheet to get markers
    url: "https://sheets.googleapis.com/v4/spreadsheets/1ucX1MKPmvVbset9evcUCJ8q-Dh_DucMxmhLz76I9kHI/values/stories?key="+config.GOOGLE_SPREADSHEET_API,
    method: "GET",
    dataType: "json",
    success:
      function(e) {
        var markers = e.values.slice(1) // ignore the headers                                        //addMarkers(markers);
        console.log(markers);
        for (let i=0; i<=markers.length-1; i++) {
          var marker = L.marker([markers[i][1],markers[i][0]]).addTo(map).bindPopup("<b>הסיפור: </b>"+markers[i][2]);
          marker.openPopup();
        }
        map.locate({setView: true, maxZoon: 16});

      }
  });
});
