var cityInputEl = document.querySelector("#city");
var userFormEl = document.querySelector("#user-form");
var submitButtonEl = document.querySelector("#submit");
var currentConditionsEl = document.querySelector("#current-conditions");
var searchCity = document.querySelector("#search-city");
var tempEl = document.querySelector("#temp");
var humidityEl = document.querySelector("#humidity");
var windEl = document.querySelector("#wind");
var iconEl = document.querySelector("#icon");
var recentSearchEl = document.querySelector("#recent-searches");
var searchArr = [];

var formSubmitHandler = function(event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    //push city into array and save to local storage
    searchArr.push(city);
    console.log(searchArr);
    localStorage.setItem("cityname", JSON.stringify(searchArr));
    //error handling
    if (city) {
        getCurrentWeather(city);
        getForecast(city);
    } else {
        alert("Please enter a city!");
    }
    
}

//fetch data from API for current weather
var getCurrentWeather = function(city) {
    console.log(1);
    var apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=046dddbb0aa4d31febc4e77558997908";

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
};

//display current weather
var displayCurrentWeather = function(data) {
    console.log("function was called");
    currentConditionsEl.innerHTML = "";
    searchCity.textContent = data.name + " (" + moment().format("MM/DD/YYYY") + ")";
    var iconcode = data.weather[0].icon;
    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    var iconDisp = document.createElement("img");
    iconDisp.setAttribute('src', iconurl);
    iconEl.appendChild(iconDisp);

    //get lat & lon from fetched data to fetch UV index
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    //fetch UV index
    fetch("http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&cnt=1&appid=046dddbb0aa4d31febc4e77558997908")
    .then(function (response) {
        response.json().then(function(data2) {
            console.log(data2);
        });
    });
    //create variables for data we want to display
    var uvi = data2.value;
    var temp = data.main.temp;
    var humidity = data.main.humidity;
    var windSpeed = data.wind.speed;
    currentConditionsEl.innerHTML = `
        <p>Temperature: ${temp} °F<p>
        <p>Humidity: ${humidity} %<p>
        <p>Wind Speed: ${windSpeed} MPH<p>
        <p id="uvi"> UV Index: ${uvi} <p>
        `;
    

};
//fetch data for 5 day forecast
var getForecast = function(city) {
    console.log(2);
    var apiUrl = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&cnt=5&units=imperial&appid=046dddbb0aa4d31febc4e77558997908";

    fetch(apiUrl)
    .then(function(response) {
        //request was successful
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                displayForecast(data, city);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
};
//display forecast data
var displayForecast = function(data) {
    for (var i = 0; i < data.list.length; i++) {

    }
}
//load recently searched cities
var recentSearch = function() {
    //create span, insert city from local storage
    var searchedCity = document.createElement("li");
    searchedCity.className = "list-group-item";
    searchedCity.textContent = localStorage.getItem("cityname");
    // append to container
    recentSearchEl.appendChild(searchedCity);

    
}
window.onload = recentSearch();
userFormEl.addEventListener("submit", formSubmitHandler);