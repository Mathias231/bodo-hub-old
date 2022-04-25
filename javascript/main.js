$.getJSON("https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=67.28&lon=14.405&altitude=11", function(data){
    
    console.log(data);

    var currentWeatherData = data.properties.timeseries[2].data.instant.details;
    console.log(currentWeatherData);

    var currentTemp = currentWeatherData.air_temperature.toFixed(0);
    var currentWind = currentWeatherData.wind_speed.toFixed(1);


    $(document).ready(function(){
        $("#tempNow").html("Temperaturen nå: " + currentTemp + " °C");
        $("#windNow").html("Vindhastigheten nå: " + currentWind + " m/s");
    });
});


// 2 is current time