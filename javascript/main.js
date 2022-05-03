$.getJSON("https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=67.28&lon=14.405&altitude=11", function(data){
    // Console log all data
    // console.log(data);

    // All data comes from the JSON object
    // The current data is the second (2) element in the object properties: timeseries: 2
    // I will now make a variable for (2) and use it to call functions further down.
    // To change time/days, change the number.
    // 2 = Today/right now
    var dataCurrent = 2
    // 17 = First data/entry for tomorrow's data (aka tomorrow)
    var dataTomorrow = 17


    // Data last updated
    var lastUpdated = data.properties.timeseries[2].time;
    // Substring to get the time
    var lastUpdatedClockTime = lastUpdated.substring(11, 16);
    
    // Append the time to the html
    $("#lastUpdated").append(lastUpdatedClockTime);
    $("#lastUpdated2").append(lastUpdatedClockTime);
    // console.log(lastUpdatedClockTime);

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
     console.log(allTime);

    // Get all data for put/set day
    var dataDate = (d) => {
        if(allTime[d].yyymmdd == allTime[d].yyymmdd){
            var date = allTime.filter(function(item){
                return item.yyymmdd == allTime[d].yyymmdd;
            })
            return date
        }
    }


    // Get temperature for put/set day
    // 2 is current temperature and 3 is for the next hour
    var temp = (d) => {
      var result = data.properties.timeseries[d].data.instant.details.air_temperature.toFixed(0);
      return result;
    }

    var wind = (d) => {
      var result = data.properties.timeseries[d].data.instant.details.wind_speed.toFixed(1);
      return result;
    }

    // Get maxTemp and minTemp for put/set day
    var maxMin = (d) => {
        var maxTemp = Math.max.apply(Math, dataDate(d).map(function(o){return o.temperature.toFixed(0)}));
        var minTemp = Math.min.apply(Math, dataDate(d).map(function(o){return o.temperature.toFixed(0)}));
        return [maxTemp, minTemp];
    }

    // Get maxWind for put/set day
    var windDate = (d) => {
      var windSpeed = dataDate(d).reduce((a, b) => a + b.wind, 0) / dataDate(d).length;
      return windSpeed.toFixed(1);
    }


    $(document).ready(function(){
        // Current weather
        $("#tempNow").html("Temperaturen nå: " + temp(2) + " °C");
        // If temperature is higher then 0, color text red
        if(temp(2) >= 0){
            $("#tempNow").css("color", "red");
        } else{
            $("#tempNow").css("color", "blue");
        }
        
        // Display current windspeed
        $("#windNow").html("Vindhastigheten nå: " + wind(2) + " m/s");

        // Weather next hour
        $("#tempNextHour").html("Temperaturen neste time: " + temp(3) + " °C");
        // If temperature is higher then 0, color text red
        if(temp(2) >= 0){
            $("#tempNextHour").css("color", "red");
        } else{
            $("#tempNextHour").css("color", "blue");
        }

        // Display next hour windspeed
        $("#windNextHour").html("Vindhastigheten neste time: " + wind(3) + " m/s");

        // Get weatherIcon for put/set day
        // 1 has data for the weather 1 hour ago, so using it's icon as current icon will match the weather outside.
        var weatherIcon = (d) => {
          var icon = data.properties.timeseries[d].data.next_1_hours.summary.symbol_code;
          return icon;
        }
    

        // Set path to weather icon
        var svgPathCurrent = "../svg/" + weatherIcon(1) + ".svg";
        // Set weather icon
        $("#weatherIcon").attr("src", svgPathCurrent);

        // Set path to weather icon
        var svgPathNextHour = "../svg/" + weatherIcon(2) + ".svg";
        // Set weather icon
        $("#weatherIconNextHour").attr("src", svgPathNextHour);

        // Set path to weather icon
        var svgPathTomorrow = "../svg/" + weatherIcon(17) + ".svg";
        

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
              maxMin: maxMin(dataCurrent)[0] + "° / " + maxMin(dataCurrent)[1] + "°",
              windMax: windDate(dataCurrent) + " m/s",
              weatherIcon: "<img src='" + svgPathCurrent + "' height='50' width='50'></img>"
            }, {
              date: 'I morgen ' + data.properties.timeseries[17].time.substring(9, 10) + '. Mai',
              maxMin: maxMin(dataTomorrow)[0] + "° / " + maxMin(dataTomorrow)[1] + "°",
              windMax: windDate(dataTomorrow) + "° m/s",
              weatherIcon: "<img src='" + svgPathTomorrow + "' height='50' width='50'></img>"
            }]
          })

    });
});