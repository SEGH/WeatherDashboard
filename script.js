// Assignments
var list = $("ul");
var cards = $("#cardDeck").children();

// Array of cities prepopulated with a few cities
var cityArray = ["Philadelphia", "Los Angeles", "Tokyo", "Johannesburg"];

// Function to display prepopulated city array at page load
renderList();

// Function to getWeather for city at the end of the array
getWeather(cityArray[cityArray.length - 1]);

// Event listener to clear input value when selected
$("#cityInput").on("click", function() {
    $(this).val("");
});

// Event listener for input button and Function to push setItem city name to city array and save in localStorage
$("#searchBtn").on("click", function () {
    var cityInput = $("#cityInput").val().trim();
    if (!getWeather(cityInput)) {
        $("#cityInput").val("Invalid City Name");
    } else {
        // If statement to check whether city is already in array
        if (cityArray.includes(cityInput)) {
            var index = cityArray.indexOf(cityInput);
            cityArray.splice(index, 1);
        }
        setLocal(cityInput);
        $("#cityInput").val("");
        getWeather(cityArray[cityArray.length - 1]);
        renderList();
    }
});

// Event listener for city list item to call functions
$(document).on("click", ".list-group-item", function () {
    var clickedCity = $(this).text();
    getWeather(clickedCity);
    var cityIndex = cityArray.indexOf(clickedCity);
    cityArray.splice(cityIndex, 1);
    setLocal(clickedCity);
    renderList();
});

// Function to set items to localStorage
function setLocal(city) {
    cityArray.push(city);
    localStorage.clear("cities");
    localStorage.setItem("cities", JSON.stringify(cityArray));
}

// Function to get city array from localStorage and display
function renderList() {
    list.empty();
    var tempArray = JSON.parse(localStorage.getItem("cities"));
    if (tempArray !== null) {
        cityArray = tempArray;
    }
    if (cityArray.length > 10) {
        for (var i = cityArray.length - 1; i > cityArray.length - 11; i--) {
            var listItem = $("<li>").text(cityArray[i]).addClass("list-group-item");
            list.append(listItem);
        }
    } else {
        cityArray.forEach(function (city) {
            var listItem = $("<li>").text(city).addClass("list-group-item");
            list.prepend(listItem);
        });
    }
}

// ajax method to getWeather
function getWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=1857cc69aec95fbf7e8fded813ff9c45";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (weatherData) {
        console.log(weatherData);
        // Display city name, current date, icon, temperature, humidity, wind speed, UV index
        renderMain(weatherData);

        // Grab data to pass to one call API
        var lat = weatherData.coord.lat;
        var lon = weatherData.coord.lon;

        var dayQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=1857cc69aec95fbf7e8fded813ff9c45";

        $.ajax({
            url: dayQueryURL,
            method: "GET"
        }).then(function (dayData) {
            console.log(dayData.daily);

            // Display UVI in jumbotron
            var uvIndex = dayData.current.uvi;
            renderUVI(uvIndex);

            // Display future weather cards includes date, icon, temperature, and humidity
            renderCards(dayData);

        });
    });
}

// Function to display current weather in jumbotron
function renderMain(weatherData) {
    $("#currentDisplay").empty();

    var cityName = $("<h2>").attr("class", "pt-4 mr-3");
    cityName.text(weatherData.name);
    $("#currentDisplay").append(cityName);

    var date = moment.unix(weatherData.dt).format("MM/DD/YYYY");
    $("#jumboDate").text(date);
    var dateDisplay = $("<h2>").attr("class", "pt-4 mr-2");
    dateDisplay.text(date);
    $("#currentDisplay").append(dateDisplay);

    var icon = weatherData.weather[0].icon;
    var alt = weatherData.weather[0].description;
    var iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
    var currentImage = $("<img>").attr("src", iconURL).attr("alt", alt);
    $("#currentDisplay").append(currentImage);

    var temp = weatherData.main.temp;
    $("#jumboTemp").html(temp + "&deg;");

    var humidity = weatherData.main.humidity + "%";
    $("#jumboHumid").text(humidity);

    var wind = weatherData.wind.speed + " MPH";
    $("#jumboWind").text(wind);
}

// Functino to display UVI in jumbotron
function renderUVI(uvIndex) {
    $("#jumboUV").text(uvIndex);
    $("#jumboUV").removeClass("bg-danger bg-primary bg-success");
    if ((uvIndex >= 0) && (uvIndex < 3)) {
        $("#jumboUV").addClass("bg-success");
    } else if ((uvIndex >= 3) && (uvIndex < 6)) {
        $("#jumboUV").addClass("bg-warning");
    } else if ((uvIndex >= 6) && (uvIndex < 8)) {
        $("#jumboUV").addClass("bg-warning");
    } else if ((uvIndex >= 8) && (uvIndex < 11)) {
        $("#jumboUV").addClass("bg-danger");
    } else {
        $("#jumboUV").addClass("bg-primary");
    }
}

// Function to display future weather in cards
function renderCards(dayData) {
    cards.each(function (cardIndex) {
        var dataIndex = cardIndex + 1;
        var cardUnix = dayData.daily[dataIndex].dt;
        var cardDate = moment.unix(cardUnix).format("MM/DD/YYYY");
        $(this).find("h5").text(cardDate);

        var cardIcon = dayData.daily[dataIndex].weather[0].icon;
        var iconAlt = dayData.daily[dataIndex].weather[0].description;
        var cardIconURL = "http://openweathermap.org/img/wn/" + cardIcon + "@2x.png";
        var imageDiv = $(this).find(".fiveDayImage");
        imageDiv.empty();
        var imageTag = $("<img>").attr("src", cardIconURL).attr("alt", iconAlt);
        imageDiv.append(imageTag);

        var cardTemp = dayData.daily[dataIndex].temp.day;
        $(this).find(".cardTemp").html("Temp: " + cardTemp + "&deg;");

        var cardHumid = dayData.daily[dataIndex].humidity + "%";
        $(this).find(".cardHum").text("Humidity: " + cardHumid);
    });
}