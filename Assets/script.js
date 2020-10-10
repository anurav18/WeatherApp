
// Enter an api key for open weather app
var apikey = prompt("Enter the api key");

//Array to store the search history
let userData = JSON.parse(localStorage.getItem("userData")) || [];
for (let i = 0; i < userData.length; i++) 
{
    var cityInput = userData[i].cityName;
    cityList(cityInput);
}

// Event handler for search button
$("#add-city").on("click",function(event){
    event.preventDefault();
    var cityInput = $("#city-input").val();
    //If the user tries to search without any input
    if(cityInput === "")
    {
        alert("enter a city name");
    }
    else
    {
      cityList(cityInput);
      userData.push({cityName:cityInput});
      localStorage.setItem("userData",JSON.stringify(userData));
      $("#add-city").attr("cityName",cityInput);
      displayWeatherInfo(cityInput);
      $("#city-input").val("");
    }
});


// creating a list of cities based on the search history
function cityList(cityInput)
{
    let ulEl = $("#cities-list");
    let newliEl = $("<li class='list-group-item'>");
    newliEl.text(cityInput);
    ulEl.append(newliEl);
    newliEl.attr("cityName",cityInput);
}

//Display weather information
function displayWeatherInfo(city){
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ city +"&appid=" + apikey;
    $.ajax({
    method:"GET",
    url: queryURL
    }).then(function(response){
    $(".display-Name").text(response.name);
    $(".display-Temparature").html("Temparature: "+ (convertKtoF(response.main.temp)).toFixed(2) + "&deg;F");
    $(".display-Humidity").text("Humidity: "+response.main.humidity+"%");
    $(".display-Windspeed").text("Wind Speed: "+response.wind.speed+"MPH");
    var imageSrc = " http://openweathermap.org/img/wn/"+response.weather[0].icon+".png";
    $("#cloud-Image").attr("src",imageSrc);
    var long = response.coord.lon;
    var lat = response.coord.lat;
    CalculateUVIndex(lat, long);
    forecast(city);
    })

}

//Temparature conversion 
function convertKtoF(tempInKelvin) {
    return ((tempInKelvin - 273.15) * 9) / 5 + 32;
  }

//Date Formatting
function ISOtoDate(isodateformat)
{
    var dateformat = (isodateformat).substring(8,10);
    var monthformat = (isodateformat).substring(5,7);
    var yearformat = (isodateformat).substring(0,4);
    return(monthformat+"/"+dateformat+"/"+yearformat);
}

//calculate UV Index
function CalculateUVIndex(lat,long){
   var queryURL =  "http://api.openweathermap.org/data/2.5/uvi?lat="+lat+"&lon="+long+"&appid="+apikey;
        $.ajax({
            url: queryURL,
            method:"GET"
        }).then(function(response){
            // color coding the UV Index value based on a specific criteria
            $("#today-date").text("("+ISOtoDate(response.date_iso)+")");
            if(response.value <= 2)
            {
                $(".display-UVindex").html("UV Index: <span style='height:25px;background-color:green;color:white'>"+response.value+"</span>");
            }
            else if(response.value >=3 && response.value <= 7)
            {
                $(".display-UVindex").html("UV Index: <span style='height:25px;background-color:orange;color:white'>"+response.value+"</span>");
            }
            else
            {
                $(".display-UVindex").html("UV Index: <span style='height:25px;background-color:red;color:white'>"+response.value+"</span>");   
            }
              
        });
}

//5 day forecast weather
function forecast(city)
{
    var newRowEl = $("#forecast-5day");
    newRowEl.empty();
    var queryURL3 = "http://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid="+apikey;
    $.ajax({
        url:queryURL3,
        method:"GET"

    }).then(function(response){
            for(var i = 1 ; i <= 40; i= i+8)
            {
                $(".Heading-2").text("5-Day Forecast:");
                var maindivEl = $("<div class='card text-white bg-primary mb-3'>");
                newRowEl.append(maindivEl);
                var cardbodyEl = $("<div class='card-body'>");
                maindivEl.append(cardbodyEl);
                var cardtitleEl = $("<h5 class='card-title'>");
                cardbodyEl.append(cardtitleEl);
                var cardimageElp = $("<p class='card-text'>");
                cardbodyEl.append(cardimageElp);
                var imageEl = $("<img class='imgsrc'>");
                var cardimgsrc11 = "http://openweathermap.org/img/wn/"+response.list[i].weather[0].icon+".png";
                imageEl.attr("src",cardimgsrc11);
                cardimageElp.append(imageEl);
                var cardtempEl = $("<p class='card-text'>");
                cardbodyEl.append(cardtempEl);
                var cardhumidityEl = $("<p class='card-text'>");
                cardbodyEl.append(cardhumidityEl);
                cardtitleEl.text(ISOtoDate(response.list[i].dt_txt));
                cardhumidityEl.text("Humidity: "+response.list[i].main.humidity+"%");
                cardtempEl.html("Temp: "+(convertKtoF(response.list[i].main.temp)).toFixed(2) + "&deg;F");
            }
        });
}

//Click event handler for all the elements declared with class city-block
$(document).on("click","li",function(event){
event.preventDefault();
var city = $(this).attr("cityName");
displayWeatherInfo(city);
});


localStorage.clear();