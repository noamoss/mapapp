// this file to set the leaflat Map service


//first import the mapbox access token from the local env, saved in the config.js file
var mapbox_access_token = config.MAPBOX_ACCESS_TOKEN;
var currentLocation = new L.LatLng(config.DEFAULT_LOCATION[1],config.DEFAULT_LOCATION[0]);    // we will start with the default location, to speed up the map load


// create a map instance object
var map = L.map('map');

// add layer to map
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 16,
    id: 'mapbox.streets',
    accessToken: mapbox_access_token
}).addTo(map);


var firstload = true;
map.locate({setView: true, maxZoom: 18, watch:true});

var popup = L.popup();                               // create a pop-up object

function onLocationFound(e) {               // when map loads, try defining user's locaition and show on map (with radius)
  currentLocation = new L.LatLng(e.latlng.lat, e.latlng.lng);

  if (firstload) {                              // center map on user's location only on first load
    console.log("location found on first load: "+currentLocation);
    map.setView(currentLocation).setZoom(16);
    firstload = false;
  }

  if (typeof(currentLocationCircle) != "undefined") {  // first, let's clear pre-existing location indicator from map
    map.removeLayer(currentLocationCircle);
  }
                                                                       // now, let's draw the new user's location circle
  radius = e.accuracy / 2;
  currentLocationCircle = new L.circle(currentLocation, radius, {color: "red", opacity: 0.5, fillColor: '#f03'});
  map.addLayer(currentLocationCircle);
  $("#longitude").val(location.lng);
  $("#longitude").attr("readonly",true);
  $("#latitude").val(location.lat);
  $("#latitude").attr("readonly",true);
}

map.on('locationfound', onLocationFound);   // when map is loaded, run onLocationFound if te location is found



function onLocationError(e) {                                      // tell user their location was not found
  if (typeof(currentLocationCircle) != "undefined") {  // first, let's clear pre-existing location indicator from map
    map.removeLayer(currentLocationCircle);
  }
  $("#longitude").val(currentLocation.lng);
  $("#longitude").removeAttr("readonly",true);
  $("#latitude").val(currentLocation.lat);
  $("#latitude").removeAttr("readonly",true);
  if (firstload) {
    alert("האפליקציה לא הצליחה לאתר את המיקום המדוייק שלך");
    map.setView(currentLocation).setZoom(16);
    firstload = false;
  }
}
map.on('locationerror', onLocationError);  // when map is loaded, run onLocationError if the location isn't found

document.getElementById("currentLocationBtn").addEventListener("click",function(){
                                                                            map.locate({setView:true, maxZoom:16});
                                                                            addStory(currentLocation);
                                                                            $("#addStory").modal("toggle");
                                                                            });
// function to run when the main button is clicked


map.on('click', onMapClick);                              // run onMapClick when user clicks the map

function onMapClick(e) {                           // actions to run when map is being clicked
  var location = e.latlng;
  addStory(location);
}

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
});


function addStory(location){                       // when we have the location field, we can set the modal fields values and expose to user input
  if (typeof(location)!="undefined") {              // if we have concrete location, populate the form's fields
    $("#longitude").val(location.lng);
    $("#latitude").val(location.lat);
    }

  $("#addStory").modal('show');
}

function objectifyForm(formArray) {//serialize data function

  var returnArray = {};
  for (var i = 0; i < formArray.length; i++){
    returnArray[formArray[i].name] = formArray[i].value;
  }
  return returnArray;
}

var $form = $('form#storyForm')[0],                             // preapre to thhe ajax call to save markers
    writeUrl = config.GOOGLE_SPREADSHEET_TABLE_URL;

$("a#spreadsheetUrl").attr("href",config.GOOGLE_SPREADSHEET_URL).attr("target","_blank");

$(document).ready(function(e){
  var jqxhr = $.ajax({                             // call the google spreadsheet to get markers
    url: "https://sheets.googleapis.com/v4/spreadsheets/1ucX1MKPmvVbset9evcUCJ8q-Dh_DucMxmhLz76I9kHI/values/stories?key="+config.GOOGLE_SPREADSHEET_API,
    method: "GET",
    dataType: "json",
    success:
      function(e) {
        var markers = e.values.slice(1); // ignore the headers                                        //addMarkers(markers);
        for (var i=0; i<=markers.length-1; i++) {
          var lat = parseFloat(markers[i][1]);
          var lng = parseFloat(markers[i][0]);
          var marker = L.marker([lat,lng]);
          marker.addTo(map).bindPopup("<b>הסיפור: </b>"+markers[i][2]);
        }
      }
  });
  map.locate({watch:true, setView:false});

});
