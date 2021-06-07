var apiKey = "826866a5790cf5163073c85ba1717ab7"
//default api key f204ae06048080c03e575ab7a8855ae6
var weatherApiUrl = 'https://api.openweathermap.org'


function currentWeather(city, weatherSearch) {
    weatherList(weatherSearch);

    var url = "https://api.openweathermap.org/data/2.5/weather?&units=imperial&appid=826866a5790cf5163073c85ba1717ab7&q=" +
        city;

    $.ajax({
        url: url,
        method: "GET"
    }).then(function (weather) {
        var currentDay = moment();

        var dateDisplay = $("<h3>");
        $("#city-name").empty();
        $("#city-name").append(dateDisplay.text("(" + currentDay.format("M/D/YYYY") + ")"));

        var cityName = $("<h3>").text(weather.name);
        $("#city-name").prepend(cityName);

        var weatherIcon = $("<img>");
        weatherIcon.attr("src", "https://openweathermap.org/img/w/" + weather.weather[0].icon + ".png");
        $("#current-day").empty();
        $("#current-day").append(weatherIcon);

        $("#current-temp").text("Temperature: " + weather.main.temp + " °F");
        $("#current-humidity").text("Humidity: " + weather.main.humidity + "%");
        $("#current-wind").text("Wind Speed: " + weather.wind.speed + " MPH");

        latitude = weather.coord.lat;
        longitude = weather.coord.lon;

        var url3 = "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid=826866a5790cf5163073c85ba1717ab7&q=" +
            "&lat=" +
            latitude +
            "&lon=" +
            longitude;

        $.ajax({
            url: url3,
            method: "GET"
        }).then(function (uvIndex) {

            var uvDisplay = $("<button>");
            uvDisplay.addClass("btn btn-success");

            $("#current-uv").text("UV Index: ");
            $("#current-uv").append(uvDisplay.text(uvIndex[0].value));
        });
    });
}

function weatherList(weatherSearch) {
    $("#city-result").empty();

    var keys = Object.keys(weatherSearch);
    for (var i = 0; i < keys.length; i++) {
        var searchBtn = $("<button>");
        searchBtn.addClass("list-group-item list-group-item-action");

        var inputLowUp = keys[i].toLowerCase().split(" ");
        for (var i = 0; i < inputLowUp.length; i++) {
            inputLowUp[i] = inputLowUp[i].charAt(0).toUpperCase() + inputLowUp[i].substring(1);
        }
        var local = inputLowUp.join(" ");
        searchBtn.text(local);

        $("#city-result").append(searchBtn);
    }
}
//var searchHistory = [];
$(document).ready(function () {
    var weatherInput = localStorage.getItem("weatherSearch");

    var weatherSearch = JSON.parse(weatherInput);

    if (weatherSearch == null) {
        weatherSearch = {};
    }

    weatherList(weatherSearch);

    $("#search-btn").on("click", function (event) {
        event.preventDefault();
        var city = $("#search-city")
            .val()
            .trim()
            .toLowerCase();

        if (city != "") {

            weatherSearch[city] = true;
            localStorage.setItem("weatherSearch", JSON.stringify(weatherSearch));

            currentWeather(city, weatherSearch);

            $("#current-weather").show();
            $("#weather-forecast").show();
        }


    });

    $("#city-result").on("click", "button", function (event) {
        event.preventDefault();
        var city = $(this).text();

        currentWeather(city, weatherSearch);

        $("#current-weather").show();
        $("#weather-forecast").show();
    });

    $("#current-weather").hide();
    $("#weather-forecast").hide();
});