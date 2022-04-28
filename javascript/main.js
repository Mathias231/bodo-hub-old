$.getJSON("https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=67.28&lon=14.405&altitude=11", function(data){
    //Console log all data
    console.log(data);

    // Current weather
    var currentWeatherData = data.properties.timeseries[2].data.instant.details;
    console.log(currentWeatherData);
    
    // Weather next hour
    var weatherNextHour = data.properties.timeseries[3].data.instant.details;
    console.log(weatherNextHour);


    $(document).ready(function(){
        // Current weather
        $("#tempNow").html("Temperaturen nå: " + currentWeatherData.air_temperature.toFixed(0) + " °C");
        $("#windNow").html("Vindhastigheten nå: " + currentWeatherData.wind_speed.toFixed(1) + " m/s");

        // Weather next hour
        $("#tempNextHour").html("Temperaturen neste time: " + weatherNextHour.air_temperature.toFixed(0) + " °C");
        $("#windNextHour").html("Vindhastigheten neste time: " + weatherNextHour.wind_speed.toFixed(1) + " m/s");

    
        // Weather description
        var weatherIcon = data.properties.timeseries[1].data.next_1_hours.summary.symbol_code;
        console.log(weatherIcon);

    });
});


// 2 is current time