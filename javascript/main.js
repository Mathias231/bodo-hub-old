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

    // Loop through the data and make an object with the data
    var allTime = [];
    // Loop through all timeseries
    for(var i = 0; i < data.properties.timeseries.length; i++){
        // Get the time
        var time = data.properties.timeseries[i].time;
        var yyymmdd = data.properties.timeseries[i].time.substring(0, 10);
        // Get the temperature
        var temperature = data.properties.timeseries[i].data.instant.details.air_temperature;
        // Create an object with the time and temperature

        var timeOjbect = {
            time: time,
            yyymmdd: yyymmdd,
            temperature: temperature
        };
        // Push the object to the arrayd
        allTime.push(timeOjbect);
    }
    // console.log(allTime);

    if(allTime[2].yyymmdd == allTime[2].yyymmdd){
        // select only datasets from 
        var dataToday = allTime.filter(function(item){
            return item.yyymmdd == allTime[2].yyymmdd;
        });
    }
    // console.log(dataToday);
    
    // max temperature
    var maxTemp = Math.max.apply(Math, dataToday.map(function(o){return o.temperature.toFixed(0);}));
    console.log(maxTemp);
    // min temperature
    var minTemp = Math.min.apply(Math, dataToday.map(function(o){return o.temperature.toFixed(0);}));
    console.log(minTemp);
    // average temperature
    var avgTemp = dataToday.reduce(function(a, b) { return a + b.temperature; }, 0) / dataToday.length;
    console.log(avgTemp);
    
    $("#maxMin").append(maxTemp + "° / " + minTemp + "°");





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



        // // Linechart for temperature with date and time every 2 hours
        // var lineChartData = [];
        // // Loop through all timeseries
        // for(var i = 0; i < 24; i++){
        //     // Get the time
        //     var time = data.properties.timeseries[i].time;
        //     // Get the temperature
        //     var temperature = data.properties.timeseries[i].data.instant.details.air_temperature;
        //     // Create an object with the time and temperature
        //     var lineChartObject = {
        //         time: time,
        //         temperature: temperature
        //     };
        //     // Push the object to the array
        //     lineChartData.push(lineChartObject);
        // }
        // console.log(lineChartData);



    });
});