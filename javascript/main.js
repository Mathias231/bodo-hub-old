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


    // data for today
    if(allTime[2].yyymmdd == allTime[2].yyymmdd){
        // select only datasets from 
        var dataToday = allTime.filter(function(item){
            return item.yyymmdd == allTime[2].yyymmdd;
        });
    }
    // console.log(dataToday);

    // data for tomorrow
    if(allTime[17].yyymmdd == allTime[17].yyymmdd){
        // select only datasets from
        var dataTomorrow = allTime.filter(function(item){
            return item.yyymmdd == allTime[17].yyymmdd;
        });
    }
    console.log(dataTomorrow);
    
    // Data for today
    // max temperature
    var maxTemp = Math.max.apply(Math, dataToday.map(function(o){return o.temperature.toFixed(0);}));
    // console.log(maxTemp);
    // min temperature
    var minTemp = Math.min.apply(Math, dataToday.map(function(o){return o.temperature.toFixed(0);}));
    // console.log(minTemp);
    // average temperature
    var avgTemp = dataToday.reduce(function(a, b) { return a + b.temperature; }, 0) / dataToday.length;
    // console.log(avgTemp);
    // wind speed
    var windSpeed = dataToday.reduce(function(a, b) { return a + b.wind; }, 0) / dataToday.length;
    // console.log(windSpeed);
    
    // Data for tomorrow
    // max temperature
    var maxTempTomorrow = Math.max.apply(Math, dataTomorrow.map(function(o){return o.temperature.toFixed(0);}));
    //console.log(maxTempTomorrow);
    // min temperature
    var minTempTomorrow = Math.min.apply(Math, dataTomorrow.map(function(o){return o.temperature.toFixed(0);}));
    // console.log(minTempTomorrow);
    // average temperature
    var avgTempTomorrow = dataTomorrow.reduce(function(a, b) { return a + b.temperature; }, 0) / dataTomorrow.length;
    // console.log(avgTempTomorrow);
    // wind speed
    var windSpeedTomorrow = dataTomorrow.reduce(function(a, b) { return a + b.wind; }, 0) / dataTomorrow.length;
    // console.log(windSpeedTomorrow);




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
        var svgPathNextHour = "../svg/" + weatherIconNextHour + ".svg";
        // Set weather icon
        $("#weatherIconNextHour").attr("src", svgPathNextHour);


        




        $('#table').bootstrapTable({
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
              maxMin: maxTemp + "° / " + minTemp + "°",
              windMax: windSpeed.toFixed(1) + " m/s",
              weatherIcon: data.properties.timeseries[2].data.next_1_hours.summary.symbol_code
            }, {
              date: 'I morgen ' + data.properties.timeseries[17].time.substring(9, 10) + '. Mai',
              maxMin: maxTempTomorrow + "° / " + minTempTomorrow + "°",
              windMax: windSpeedTomorrow.toFixed(1) + " m/s",
              weatherIcon: data.properties.timeseries[17].data.next_1_hours.summary.symbol_code
            }]
          })




    });
});