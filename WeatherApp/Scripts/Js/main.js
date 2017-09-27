var x = document.getElementById("demo");
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;
}

// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var map, infoWindow, geocoder;
var itemLocality = '';
function initMap() {
    infoWindow = new google.maps.InfoWindow;
    geocoder = new google.maps.Geocoder;
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 58.05, lng: 11.8 },
        zoom: 8
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            $("#latlng").val(position.coords.latitude + ", " + position.coords.longitude)
            //infoWindow.setPosition(pos);
            //infoWindow.setContent('Location found.');
            //infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
    getCoords(map)
    geocodeLatLng(geocoder, map, infoWindow);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function getCoords(map) {
    google.maps.event.addListener(map, "click", function (event) {
        var lat = event.latLng.lat();
        var lng = event.latLng.lng();
        $("#latlng").val(lat + "," + lng)
        $("#lat").html('Lat: ' + lat)
        $("#lon").html('Lon: ' + lng)
        geocodeLatLng(geocoder, map, infoWindow);
    });
}

function geocodeLatLng(geocoder, map, infoWindow) {
    var input = document.getElementById('latlng').value;
    var latlngStr = input.trim().split(',', 2);
    var latlng = { lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1]) };
    geocoder.geocode({ 'location': latlng }, function (results, status) {
        if (status === 'OK') {
            if (results[0]) {
                alert(results[0].formatted_address)
                var itemLocality = '';
                var arrAddress = results[0].address_components;
                $.each(arrAddress, function (i, address_component) {
                    console.log('address_component:' + i);

                    if (address_component.types[0] == "postal_town") {
                        console.log("town:" + address_component.long_name);
                        itemLocality = address_component.long_name;
                        $("#city").val(itemLocality)
                    }
                })
        } else {
                window.alert('No results found');
            }
        } else {
            window.alert('Geocoder failed due to: ' + status);
        }
    });
}
