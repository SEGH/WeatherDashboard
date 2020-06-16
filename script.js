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
});

// Function to get city array from localStorage and display
function renderList() {
    list.empty();
    var tempArray = JSON.parse(localStorage.getItem("cities"));
    cityArray = tempArray;
    cityArray.forEach(function (city) {
        var listItem = $("<li>").text(city).addClass("list-group-item");
        list.prepend(listItem);
    })
}
// ajax method to getWeather

    // Display city name, current date, icon, temperature, humidity, wind speed, UV index

    // Display future weather cards includes date, icon, temperature, and humidity

// Function to getWeather for city at the end of the array

// Event listener to getWeather for clicked city