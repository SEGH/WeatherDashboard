// Assignments
var list = $("ul");

// Array of cities prepopulated with a few cities
var cityArray = ["Philadelphia", "Los Angeles", "Tokyo", "Johannesburg"];

// Function to display prepopulated city array at page load
renderList();

// Event listener for input button and Function to push setItem city name to city array and save in localStorage
$("#searchBtn").on("click", function () {
    var cityInput = $("#cityInput").val().trim();
    // If statement to check whether city is already in array
    if (cityArray.includes(cityInput)) {
        var index = cityArray.indexOf(cityInput);
        cityArray.splice(index, 1);
    }
    setLocal(cityInput);
    $("#cityInput").val("");
    getWeather(cityArray[cityArray.length - 1]);
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
        for (var i = cityArray.length -1 ; i > cityArray.length - 11; i--) {
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
        // Display city name, current date, icon, temperature, humidity, wind speed, UV index
        console.log(weatherData);
        var city = weatherData.name;
        $("#cityName").text(city);

        var unixDate = weatherData.dt;
        var date = moment.unix(unixDate).format("MM/DD/YYYY");
        $("#jumboDate").text(date);

        var temp = weatherData.main.temp;
        $("#jumboTemp").html(temp + "&deg;");

        var humidity = weatherData.main.humidity + "%";
        $("#jumboHumid").text(humidity);

        var wind = weatherData.wind.speed + " MPH";
        $("#jumboWind").text(wind);

        var icon = weatherData.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        $("#currentImage").attr("src", iconURL);

        var lat = weatherData.coord.lat;
        var lon = weatherData.coord.lon;

        var dayQueryURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+ lat + "&lon=" + lon + "&units=imperial&appid=1857cc69aec95fbf7e8fded813ff9c45";

        $.ajax({
            url: dayQueryURL,
            method: "GET"
        }).then(function(dayData) {
            // Display future weather cards includes date, icon, temperature, and humidity
            console.log(dayData.daily);

            var uvIndex = dayData.current.uvi;
            $("#jumboUV").text(uvIndex);
            $("#jumboUV").removeClass("bg-danger bg-primary bg-success");
            if ((uvIndex >= 0) && (uvIndex < 3)) {
                $("#jumboUV").addClass("bg-success");
            } else if ((uvIndex >= 3) && (uvIndex < 6)) {
                $("#jumboUV").addClass("bg-warning");
            } else if ((uvIndex >= 6) && (uvIndex < 8)) {
                $("#jumboUV").addClass("bg-warning"); // consider orange background
            } else if ((uvIndex >= 8) && (uvIndex < 11)) {
                $("#jumboUV").addClass("bg-danger");
            } else {
                $("#jumboUV").addClass("bg-primary"); // consider purple background
            }

            var cards = $("#cardDeck").children();
            cards.each(function(cardIndex) {
                var dataIndex = cardIndex + 1;
                var cardUnix = dayData.daily[dataIndex].dt;
                var cardDate = moment.unix(cardUnix).format("MM/DD/YYYY");
                $(this).find("h5").text(cardDate);

                var cardIcon = dayData.daily[dataIndex].weather[0].icon;
                var cardIconURL = "http://openweathermap.org/img/wn/" + cardIcon + "@2x.png";
                $(this).find("img").attr("src", cardIconURL);

                var cardTemp = dayData.daily[dataIndex].temp.day;
                $(this).find(".cardTemp").html("Temp: " + cardTemp + "&deg;");

                var cardHumid = dayData.daily[dataIndex].humidity + "%";
                $(this).find(".cardHum").text("Humidity: " + cardHumid);
                
            });
        });
    });
}

// Function to getWeather for city at the end of the array
getWeather(cityArray[cityArray.length - 1]);

// Event listener for city list item to call functions
$(document).on("click", ".list-group-item", function() {
    var clickedCity = $(this).text();
    getWeather(clickedCity);
    var cityIndex = cityArray.indexOf(clickedCity);
    cityArray.splice(cityIndex, 1);
    setLocal(clickedCity);
    renderList();
});