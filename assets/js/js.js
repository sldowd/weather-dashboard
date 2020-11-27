var cityInputEl = document.querySelector("#city");
var userFormEl = document.querySelector("#user-form");
var submitButtonEl = document.querySelector("#submit");

var formSubmitHandler = function(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    console.log(city);

    if (city) {
        getCurrentWeather(city);
    } else {
        alert("Please enter a city!");
    }
    
}
//fetch data from API
var getCurrentWeather = function(city) {
    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=046dddbb0aa4d31febc4e77558997908";

    fetch(apiUrl)
    .then(function(response) {
        //request was successful
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                displayCurrentWeather(data, city);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
}

//display current weather
var displayCurrentWeather = function() {

}

userFormEl.addEventListener("submit", formSubmitHandler);