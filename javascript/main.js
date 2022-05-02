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
        var wind = data.properties.timeseries[i].data.instant.details.wind_speed;
        
        // Create an object with the time and temperature
        var timeOjbect = {
            time: time,
            yyymmdd: yyymmdd,
            temperature: temperature,
            wind: wind
        };
        // Push the object to the arrayd
        allTime.push(timeOjbect);
    }
    // console.log(allTime);

    // Get all data for put/set day
    var dataDate = (d) => {
        if(allTime[d].yyymmdd == allTime[d].yyymmdd){
            var date = allTime.filter(function(item){
                return item.yyymmdd == allTime[d].yyymmdd;
            })
            return date
        }
    }

    // Get maxTemp and minTemp for put/set day
    var maxMin = (d) => {
        var maxTemp = Math.max.apply(Math, dataDate(d).map(function(o){return o.temperature.toFixed(0)}));
        var minTemp = Math.min.apply(Math, dataDate(d).map(function(o){return o.temperature.toFixed(0)}));
        return [maxTemp, minTemp];
    }

    var windSpeed = dataDate(2).reduce((a, b) => a + b.wind, 0) / dataDate(2).length;
    var windSpeedTomorrow = dataDate(17).reduce((a, b) => a + b.wind, 0) / dataDate(17).length;

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
        var svgPathCurrent = "../svg/" + weatherIconCurrent + ".svg";
        // Set weather icon
        $("#weatherIcon").attr("src", svgPathCurrent);
        //console.log(weatherIconCurrent);
        
        // Weather description
        // Grabbing weather symbol from timeseries[2] and uses it's "next_1_hours" to get the weather icon to predict the weather for the next hour
        var weatherIconNextHour = data.properties.timeseries[2].data.next_1_hours.summary.symbol_code;
        // Set path to weather icon
        var svgPathNextHour = "../svg/" + weatherIconNextHour + ".svg";
        // Set weather icon
        $("#weatherIconNextHour").attr("src", svgPathNextHour);

        var weatherIconTomorrow = data.properties.timeseries[17].data.next_1_hours.summary.symbol_code;
        // Set path to weather icon
        var svgPathTomorrow = "../svg/" + weatherIconTomorrow + ".svg";
              

        $('#table').bootstrapTable({
            locale: 'en-US',
            columns: [{
              field: 'date',
              title: 'Dager'
            }, {
              field: 'maxMin',
              title: 'Maks/min. Temp'
            }, {
              field: 'windMax',
              title: 'Vindstyrke'
            }, {
                field: 'weatherIcon',
                title: 'Vær ikon'
              }],
            data: [{
              date: 'I dag ' + data.properties.timeseries[2].time.substring(9, 10) + '. Mai',
              maxMin: maxMin(2)[0] + "° / " + maxMin(2)[1] + "°",
              windMax: windSpeed.toFixed(1) + " m/s",
              weatherIcon: "<img src='../svg/" + weatherIconCurrent + ".svg' height='50' width='50'></img>"
            }, {
              date: 'I morgen ' + data.properties.timeseries[17].time.substring(9, 10) + '. Mai',
              maxMin: maxMin(17)[0] + "° / " + maxMin(17)[1] + "°",
              windMax: windSpeedTomorrow.toFixed(1) + " m/s",
              weatherIcon: "<img src='" + svgPathTomorrow + "' height='50' width='50'></img>"
            }]
          })

    });
});