// API key
var apiKey = "&APPID=5ead3e58beafcafc6afda9c1a5c26a02";

//global variables
var city=""

var searchCity = $("#searchCity");
var searchButton = $("#searchBtn");
var clearButton = $("#clearBtn");
var currentCity = $("#currentCity");
var currentTemp = $("#temperature");
var currentHum= $("#humidity");
var currentSpeed=$("#windSpeed");
var currentUV= $("#uvIndex");

var cityArray = [];

function displayWeather() {
    event.preventDefault();

    // make right column visible
    $("#right-col").removeClass("d-none")

    // if search field is not blank
    if (searchCity !== "") {
        city = searchCity.val().trim();
        currentWeather(city)
    }
}

function currentWeather(city) {

    // make right column visible
    $("#right-col").removeClass("d-none")

    fetch ("https://api.openweathermap.org/data/2.5/weather?q="
        + city + apiKey + "&units=imperial")
        .then(function(response){
            return response.json();
        })
        .then(function(response){
            console.log(response)

            //date
            var date = new Date(response.dt*1000).toLocaleDateString();
            // console.log("Date: " + date)

            //icon
            var weathericon = response.weather[0].icon;
            var iconurl="https://openweathermap.org/img/wn/" + weathericon +"@2x.png";

            $(currentCity).html(response.name +"("+date+")" + "<img src="+iconurl+">");

            //temperature
            var tempF = Math.round(response.main.temp);
            $(currentTemp).html(tempF +"°F");

            //humidity
            $(currentHum).html(response.main.humidity+"%");

            //wind speed
            var windspeed = response.wind.speed.toFixed(2);
            $(currentSpeed).html(windspeed +" MPH");

            //UV index
            var lat = response.coord.lat
            var lon = response.coord.lon

            fetch ("http://api.openweathermap.org/data/2.5/uvi?"
                + "lat=" + lat + "&lon=" + lon + apiKey)
                .then(function(response) {
                    return response.json();
                })
                .then(function(response) {
                    console.log(response)
                    $(currentUV).html(response.value);

                    if (parseInt(response.value) < 3) {
                        $(currentUV).addClass("bg-success")
                        $(currentUV).removeClass("bg-warning")
                        $(currentUV).removeClass("bg-danger")

                    }
                    else if (response.value >= 3 & response.value < 8) {
                        $(currentUV).addClass("bg-warning")
                        $(currentUV).removeClass("bg-success")
                        $(currentUV).removeClass("bg-danger")
                    }
                    else if (response.value >= 8) {
                        $(currentUV).addClass("bg-danger")
                        $(currentUV).removeClass("bg-warning")
                        $(currentUV).removeClass("bg-success")
                    }
                })
            $("#searchCity").val("")
            forecast(response.id)

            // if fetch is succesful
            // if(response.cod==200) {
            //     cityArray=JSON.parse(localStorage.getItem("storedCities"));
            //     console.log(cityArray)

            //     if (!cityArray) {
            //         cityArray =[];
            //         cityArray.push(city.toUpperCase());
            //         localStorage.setItem("storedCities",JSON.stringify(cityArray));
            //         // addToList(city)
            //     }
            //     else {
            //         cityArray.push(city.toUpperCase());
            //         localStorage.setItem("storedCities",JSON.stringify(cityArray));
            //         // addToList(city)
            //     }
            // }
        })
}

function forecast(cityId) {
    fetch("http://api.openweathermap.org/data/2.5/forecast?id="
    + cityId + apiKey + "&units=imperial")
    .then(function(response){
        return response.json();
    })
    .then(function(response){
        console.log(response)

        for (i=0; i<5; i++) {

            var date = new Date(response.list[((i+1)*8)-1].dt*1000).toLocaleDateString();
            var iconcode = response.list[((i+1)*8)-1].weather[0].icon;
            var iconurl = "https://openweathermap.org/img/wn/"+iconcode+".png";
            var tempF = response.list[((i+1)*8)-1].main.temp;
            var humidity = response.list[((i+1)*8)-1].main.humidity;

            $("#forecastDate"+i).html(date);
            $("#forecastImg"+i).html("<img src="+iconurl+">");
            $("#forecastTemp"+i).html(tempF+"&#8457");
            $("#forecastHumidity"+i).html(humidity+"%");
        }

    });
}

function addToList(newcity){
    if (searchCity !== "") {
        newcity = searchCity.val().trim();
        // currentWeather(city)
        console.log("hi")

        cityArray.push(newcity.toUpperCase());
        localStorage.setItem("storedCities",JSON.stringify(cityArray));
    }

    else {
        newcity=cityArray[i]
        console.log(cityArray[i])

        var listEl= $("<a>"+newcity.toUpperCase()+"</a>");
        $(listEl).attr("class","list-group-item list-group-item-action");
        $(listEl).attr("data-value",newcity.toUpperCase());
        $(".list-group").append(listEl);
        // $("#searchCity").val("")
    }



}

function changeCity(event){
    var liEl=event.target;
    if (event.target.matches("a")){
        city=liEl.textContent.trim();
        currentWeather(city);
    }
}

//loads cityArrray from storage, lists each item from the array, displays weather for first item

function loadlastCity(){

    var cityArray = JSON.parse(localStorage.getItem("storedCities"));
    if(cityArray!==null){
        // cityArray=JSON.parse(localStorage.getItem("storedCities"));
        city=cityArray[0];
        currentWeather(city);

        for(i=0; i<cityArray.length;i++){
            // console.log(cityArray[i])
            addToList(cityArray[i]);
        } 
    }
    else {
        console.log("cityArray is empty")
        cityArray = []
    }
}

//Clear the search history from the page, clear localStorage, reload page
function clearHistory(event){
    event.preventDefault();
    cityArray=[];
    localStorage.clear();
    document.location.reload();
}

$("#searchBtn").on("click",displayWeather);
$("#searchBtn").on("click",addToList);
$(document).on("click",changeCity);
$(window).on("load",loadlastCity);
$("#clearBtn").on("click",clearHistory);

