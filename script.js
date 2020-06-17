// Assignments
var list = $("ul");

// Array of cities prepopulated with a few cities
var cityArray = ["Philadelphia", "Los Angeles", "Tokyo", "Johannesburg"];

// Function to display prepopulated city array at page load
renderList();

// Event listener for input button and Function to push setItem city name to city array and save in localStorage
$("#searchBtn").on("click", function () {
    var cityInput = $("#cityInput").val().trim();
    // Add if statement to check whether city is already in array
    cityArray.push(cityInput);
    localStorage.setItem("cities", JSON.stringify(cityArray));
    $("#cityInput").val("");
    renderList();
    // displayLast function
    getWeather(cityArray[cityArray.length - 1]);
});

// Function to get city array from localStorage and display
function renderList() {
    list.empty();
    var tempArray = JSON.parse(localStorage.getItem("cities"));
    if (tempArray !== null) {
        cityArray = tempArray;
    }
    cityArray.forEach(function (city) {
        var listItem = $("<li>").text(city).addClass("list-group-item");
        list.prepend(listItem);
    })
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
            if (uvIndex > 8) {
                $("#jumboUV").addClass("bg-danger");
            }
            var cards = $(".card-deck").children();
            cards.each(function(cardIndex) {
                console.log(cardIndex);
                var dataIndex = cardIndex + 1;
                var cardUnix = dayData.daily[dataIndex].dt;
                var cardDate = moment.unix(cardUnix).format("MM/DD/YYYY");
                $(this).find("h5").text(cardDate);

                var cardIcon = dayData.daily[dataIndex].weather[0].icon;
                var cardIconURL = "http://openweathermap.org/img/wn/" + cardIcon + "@2x.png";
                $(this).find("img").attr("src", cardIconURL);

                var cardTemp = dayData.daily[dataIndex].temp.day;
                $(this).find(".cardTemp").html(cardTemp + "&deg;");

                var cardHumid = dayData.daily[dataIndex].humidity + "%";
                $(this).find(".cardHum").text(cardHumid);
                
            });
        });
    });
}
// Function to getWeather for city at the end of the array
getWeather(cityArray[cityArray.length - 1]);

// Event listener to getWeather for clicked city
$(".list-group-item").on("click", function() {
    var city = $(this).text();
    getWeather(city);
})