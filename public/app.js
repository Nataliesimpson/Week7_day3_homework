
window.onload = function () {
    var url = 'https://restcountries.eu/rest/v1'
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onload = function () {
        if (request.status === 200) {
            var jsonString = request.responseText;
            var countries = JSON.parse(jsonString);
            main(countries);    
        }
    }
    request.send();

};

var main = function (countries) {
    populateSelect(countries);
    var cached = localStorage.getItem("selectedCountry");
    var selected = countries[0];
    if(cached){
        selected = JSON.parse(cached);
        document.querySelector('#countries').selectedIndex = selected.index;
    }
    updateDisplay(selected);
    document.querySelector('#info').style.display = 'block';
}

var populateSelect = function (countries) {
    var parent = document.querySelector('#countries');
    countries.forEach(function (item, index) {
        item.index = index;
        var option = document.createElement("option");
        option.value = index.toString();
        option.text = item.name;
        parent.appendChild(option);
    });
    parent.style.display = 'block';
    parent.addEventListener('change', function (e) {
        var index = this.value;
        var country = countries[index];
        updateDisplay(country);
        localStorage.setItem("selectedCountry",JSON.stringify(country));
    });
}

var updateDisplay = function (lala) {
    var tags = document.querySelectorAll('#info p');
    tags[0].innerText = "Country: " + lala.name;
    tags[1].innerText = "Population: " + lala.population;
    tags[2].innerText = "Capital: " + lala.capital;
    var latLng = {lat: lala.latlng[0], lng: lala.latlng[1]}
    var map = new Map( latLng, 8 );
    map.addMarker(latLng)
    map.addInfoWindow(latLng, lala)
}

var Map = function( latLng, zoom ){
    this.googleMap = new google.maps.Map( document.getElementById( 'map' ), {
    center: latLng,
    zoom: zoom  
  })  

this.addMarker = function( latLng, title ) {
  var marker = new google.maps.Marker( {
    position: latLng,
    map: this.googleMap,
    title: title
  })
  return marker;
} 

this.addInfoWindow = function( latLng, title ) {
  var marker = this.addMarker( latLng, title.name )
  marker.addListener( 'click', function() {
    var infoWindow = new google.maps.InfoWindow({
      content: '<p>This country is: </p>' + title.name + '<p>Capital city: </p>' + title.capital + '<p>Population: </p>' + title.population 
      })
      infoWindow.open( this.map, marker )
    })
  }


}






