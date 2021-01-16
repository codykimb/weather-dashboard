// API key
var apiKey = "&appid=5ead3e58beafcafc6afda9c1a5c26a02";

var city = $("searchTerm").val;
var date = new Date();

//when the user clicks the searchBtn
$("#searchBtn").on("click", function() {

    // made forecast header visible
    $("#forecaseH5").addClass("d-block");
    $("#forecaseH5").removeClass("d-none");

    city = $("#searchTerm").val();

    // clear searchTerm
    $("#searchTerm").val("")

    fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" + 
        city + apiKey
    )
    .then(function(response) {

        console.log(response)

        // currentConditions(response);
        // currentForecast(response);
        // createList();

    })
});

function currentConditions(response) {

    var temp = response.main.temp
    
    // clear currrentCity
    $('#currentCity').empty();

    // create variables
    var card = $("<div>").addClass("card");
    var cardBody = $("<div>").addClass("card-body");
    var city = $("<h4>").addClass("card-title").text(response.name);
    var cityDate = $("<h4>").addClass("card-title").text(date);
    var temperature = $("<p>").addClass("card-text current-temp").text("Temp: " + temp + " °F");
    var humidity = $("<p>").addClass("card-text current-humidity").text("Humidity: " + response.main.humidity + "%");
    var wind = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + response.wind.speed + "MPH");
    var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png")

    // append to page
    city.append(cityDate, image);
    cardBody.append(city, temperature, humidty, wind);
    card.append(cardBody)
    $("#currentCity").append(card)
}

function createList() {

    // create list item and append
    var listItem = $("<li>").addClass("list-group-item").text(city);
    $(".list").append(listItem);

    



}
