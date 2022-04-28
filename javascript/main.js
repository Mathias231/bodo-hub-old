$.getJSON("https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=67.28&lon=14.405&altitude=11", function(data){
    //Console log all data
    console.log(data);

    // Data last updated
    var lastUpdated = data.properties.timeseries[2].time;
    // Substring to get the time
    var lastUpdatedClockTime = lastUpdated.substring(11, 16);
    // Append the time to the html
    $("#lastUpdated").append(lastUpdatedClockTime);
    $("#lastUpdated2").append(lastUpdatedClockTime);
    // console.log(lastUpdatedClockTime);

    // Current weather
    var currentWeatherData = data.properties.timeseries[2].data.instant.details;
    //console.log(currentWeatherData);
    
    // Weather next hour
    var weatherNextHour = data.properties.timeseries[3].data.instant.details;
    // console.log(weatherNextHour);


    $(document).ready(function(){
        // Current weather
        $("#tempNow").html("Temperaturen nå: " + currentWeatherData.air_temperature.toFixed(0) + " °C");
        if(currentWeatherData.air_temperature >= 0){
            $("#tempNow").css("color", "red");
        } else{
            $("#tempNow").css("color", "blue");
        }
        
        $("#windNow").html("Vindhastigheten nå: " + currentWeatherData.wind_speed.toFixed(1) + " m/s");

        // Weather next hour
        $("#tempNextHour").html("Temperaturen neste time: " + weatherNextHour.air_temperature.toFixed(0) + " °C");
        if(weatherNextHour.air_temperature >= 0){
            $("#tempNextHour").css("color", "red");
        } else{
            $("#tempNextHour").css("color", "blue");
        }
        $("#windNextHour").html("Vindhastigheten neste time: " + weatherNextHour.wind_speed.toFixed(1) + " m/s");

    
        // Weather description for current weather
        // Grabbing weather symbol from timeseries[1] (wich is the previous hour) and uses it's "next_1_hours" to get the weather icon
        var weatherIconCurrent = data.properties.timeseries[1].data.next_1_hours.summary.symbol_code;
        // Set path to weather icon
        var svgPath = "../svg/" + weatherIconCurrent + ".svg";
        // Set weather icon
        $("#weatherIcon").attr("src", svgPath);
        //console.log(weatherIconCurrent);

        // Weather description
        // Grabbing weather symbol from timeseries[2] and uses it's "next_1_hours" to get the weather icon to predict the weather for the next hour
        var weatherIconNextHour = data.properties.timeseries[2].data.next_1_hours.summary.symbol_code;
        // Set path to weather icon
        var svgPath = "../svg/" + weatherIconNextHour + ".svg";
        // Set weather icon
        $("#weatherIconNextHour").attr("src", svgPath);
        
        
    });
});


// 2 is current time