
let citiesBlockEl = $(".selected-cities");
$("#add-city").on("click",function(event){
    event.preventDefault();
    var cityInput = $("#city-input").val();
    let ulEl = $("#cities-list");
    let newliEl = $("<li class='list-group-item'>");
    newliEl.text(cityInput);
    ulEl.append(newliEl);
    newliEl.attr("cityName",cityInput);
   $("#add-city").attr("cityName",cityInput);
   displayWeatherInfo(cityInput);

});


var apikey = "5a16da0f6c2273bd4b86510d10778287";

function displayWeatherInfo(city){
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ city +"&appid=" + apikey;
    $.ajax({
    method:"GET",
    url: queryURL
    }).then(function(response){
console.log(response);
$(".display-Name").text(response.name +"("+ moment().format('L')+")");

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
    // (360K − 273.15) × 9/5 + 32 = 188.33°F
    return ((tempInKelvin - 273.15) * 9) / 5 + 32;
  }

//calculate UV Index

function CalculateUVIndex(lat,long){
   var queryURL =  "http://api.openweathermap.org/data/2.5/uvi?lat="+lat+"&lon="+long+"&appid="+apikey;

$.ajax({
    url: queryURL,
    method:"GET"
}).then(function(response){
    console.log(response);
    // $(".display-UVindex").text("UV Index: "+ response.value);
    $(".display-UVindex").html("UV Index: <span style='background-color:red'>"+response.value+"</span>");
    console.log("UV index calculated");
})
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
    for(var i = 0 ; i < 5; i++)
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
        cardtitleEl.text(moment().add(i+1, 'days').format('L'));
        cardhumidityEl.text("Humidity: "+response.list[i].main.humidity+"%");
        cardtempEl.html("Temp: "+(convertKtoF(response.list[i].main.temp)).toFixed(2) + "&deg;F");
    }
  });
}

//On Click event handler for all the elements declared with class city-block

$(document).on("click","li",function(event){
event.preventDefault();
var city = $(this).attr("cityName");
displayWeatherInfo(city);
});
