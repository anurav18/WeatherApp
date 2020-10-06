
let citiesBlockEl = $(".selected-cities");
$("#add-city").on("click",function(event){
    event.preventDefault();var cityInput = $("#city-input").val();
    let newDivEl = $("<div>");
    newDivEl.attr("class","row");
    newDivEl.addClass("city-block");
    let newSpanEl = $("<span>");
    newSpanEl.attr("class","city-span");
    newDivEl.attr("cityName",cityInput);
    console.log(cityInput);
    newSpanEl.text(cityInput);
    citiesBlockEl.append(newDivEl);
    newDivEl.append(newSpanEl);

});


var apikey = "5a16da0f6c2273bd4b86510d10778287";
for(var i = 1; i<6;i++)
{
    console.log(moment().add(i, 'days').format('L'));
}
function displayWeatherInfo(){
    var city = $(this).attr("cityName");
    
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ city +"&appid=" + apikey;
    $.ajax({
    method:"GET",
    url: queryURL
    }).then(function(response){
console.log(response);
$(".display-Name").text(response.name +"("+ moment().format('L')+")");
$(".display-Temparature").text(response.main.temp);
$(".display-Humidity").text(response.main.humidity);
$(".display-Windspeed").text(response.wind.speed);
console.log(response.weather[0].icon);
var imageSrc = " http://openweathermap.org/img/wn/"+response.weather[0].icon+".png";
$("#cloud-Image").attr("src",imageSrc);
var long = response.coord.lon;
var lat = response.coord.lat;
CalculateUVIndex(lat, long);
forecast(city);
    })


}

//calculate UV Index

function CalculateUVIndex(lat,long){
    // var apikey = "5a16da0f6c2273bd4b86510d10778287";
   var queryURL =  "http://api.openweathermap.org/data/2.5/uvi?lat="+lat+"&lon="+long+"&appid="+apikey;
// 
$.ajax({
    url: queryURL,
    method:"GET"
}).then(function(response){
    console.log(response);
    $(".display-UVindex").text(response.value);
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

        //text for card title
        cardtitleEl.text(moment().add(i+1, 'days').format('L'));

        //text for humidity

        cardhumidityEl.text(response.list[i].main.humidity);

        //text for temparature

        cardtempEl.text(response.list[i].main.temp);

        //setting image url

        




    }


    });
}



$(document).on("click",".city-block",displayWeatherInfo);
