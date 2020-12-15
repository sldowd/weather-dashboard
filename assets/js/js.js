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

var formSubmitHandler = function (event) {
  event.preventDefault();
  var searchArr = JSON.parse(localStorage.getItem("cityname"));
  var city = cityInputEl.value.trim();
  //push city into array and save to local storage
  if (!searchArr.includes(city)) searchArr.push(city);
  console.log(searchArr);
  localStorage.setItem("cityname", JSON.stringify(searchArr));
  recentSearch();
  //error handling
  if (city) {
    getCurrentWeather(city);
    getForecast(city);
  } else {
    alert("Please enter a city!");
  }
};

//fetch data from API for current weather
var getCurrentWeather = function (city) {
  console.log(1);
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=046dddbb0aa4d31febc4e77558997908";

  fetch(apiUrl).then(function (response) {
    //request was successful
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
        displayCurrentWeather(data, city);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
};

//display current weather
var displayCurrentWeather = function (data) {
  console.log("function was called");
  currentConditionsEl.innerHTML = "";
  searchCity.textContent =
    data.name + " (" + moment().format("MM/DD/YYYY") + ")";
  var iconcode = data.weather[0].icon;
  var iconurl = "https://openweathermap.org/img/w/" + iconcode + ".png";
  var iconDisp = document.createElement("img");
  iconDisp.setAttribute("src", iconurl);
  iconEl.appendChild(iconDisp);

  //get lat & lon from fetched data to fetch UV index
  var lat = data.coord.lat;
  var lon = data.coord.lon;
  //fetch UV index
  fetch(
    "https://api.openweathermap.org/data/2.5/uvi?lat=" +
      lat +
      "&lon=" +
      lon +
      "&cnt=1&appid=046dddbb0aa4d31febc4e77558997908"
  ).then(function (response) {
    response.json().then(function (data) {
      console.log("UVI", data);
    });
  });
  //create variables for data we want to display
  var uvi = data.value;
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
var getForecast = function (city) {
  console.log(2);
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&cnt=5&units=imperial&appid=046dddbb0aa4d31febc4e77558997908";

  fetch(apiUrl).then(function (response) {
    //request was successful
    if (response.ok) {
      response.json().then(function (data) {
        console.log("5day", data);
        displayForecast(data, city);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
};
//display forecast data
var displayForecast = function (data) {
  for (var i = 0; i < data.list.length; i++) {
    let dayCard = document.createElement("div");
    dayCard.className = "card";
    var date = moment()
      .add(parseInt([i]), "day")
      .format("MM/DD/YYYY");
    console.log(date);
    $(dayCard).html(date);
    // var iconcode = data.list[i].weather[0].icon;
    // console.log(iconcode);
    // var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    // var iconDisp = document.createElement("img");
    // iconDisp.setAttribute('src', iconurl);
    // var iconSpan = document.createElement("span");
    // iconSpan.appendChild(iconDisp);
    var temp = data.list[i].main.temp;
    var humidity = data.list[i].main.humidity;
    console.log(temp, humidity);
    dayCard.innerHTML = `
        <h3>${date}</h3>
        <p>Temperature: ${temp}°F<p>
        <p>Humidity: ${humidity}%<p>`;
    $("#five-day").append(dayCard);
  }
};
//load recently searched cities
var recentSearch = function () {
  let retrievedCities = JSON.parse(localStorage.getItem("cityname"));
  recentSearchEl.innerHTML = "";
  retrievedCities.forEach(function (city) {
    recentSearchEl.innerHTML += `<li class='city list-group-item'>${city}</li>`;
  });
  document.querySelectorAll('.city').forEach(function (cityli) {
      cityli.addEventListener("click", function(){
          console.log(this);
        getCurrentWeather(this.textContent);
        getForecast(this.textContent);
      })
  })
};

if (localStorage.getItem("cityname") === null) {
  localStorage.setItem("cityname", JSON.stringify([]));
  console.log("test");
}
recentSearch();
userFormEl.addEventListener("submit", formSubmitHandler);
