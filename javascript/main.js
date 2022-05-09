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
    // 42 = Day after tomorrow
    var dataDayAfterTomorrow = 42
    // 53 = Day after tomorrow
    var dataDayAfterTomorrow2 = 54
    // 59 = Day after tomorrow
    var dataDayAfterTomorrow3 = 59
    // 62 = Day after tomorrow
    var dataDayAfterTomorrow4 = 62
    // 66 = Day after tomorrow
    var dataDayAfterTomorrow5 = 66
    // 71 = Day after tomorrow
    var dataDayAfterTomorrow6 = 71

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
        var yyymmdd = data.properties.timeseries[i].time.substring(0, 10);
        var year = data.properties.timeseries[i].time.substring(0, 4);
        var month = data.properties.timeseries[i].time.substring(5, 7);
        var day = data.properties.timeseries[i].time.substring(8, 10);
        var dato = new Date(year, month-1, day);
        var readable_date = dato.toDateString();
        // Get the temperature
        var temperature = data.properties.timeseries[i].data.instant.details.air_temperature;
        var wind = data.properties.timeseries[i].data.instant.details.wind_speed;
        
        // Create an object with the time and temperature
        var timeOjbect = {
            dato: readable_date,
            yyymmdd: yyymmdd,
            temperature: temperature,
            wind: wind
        };
        // Push the object to the arrayd
        allTime.push(timeOjbect);
    }
    // console.log(allTime);

    // Get the date as number and make it readable
    var getDate = (d) => {
        var day = allTime[d].dato.substring(0, 3);
        var dateNumber = allTime[d].dato.substring(8, 10);
        var month = allTime[d].dato.substring(4, 7);
        return [day, dateNumber, month];
    }
      
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

    // Get weatherIcon for put/set day
    // 1 has data for the weather 1 hour ago, so using it's icon as current icon will match the weather outside.
    var weatherIcon = (d) => {
      var icon = data.properties.timeseries[d].data.next_1_hours.summary.symbol_code;
      return icon;
    }

    // A fucntion that seperates data from the current day and the next day
    var separateDay = (d) => {
      var day = data.properties.timeseries[d].time.substring(0, 10);
      // select data where day is equal to the day
      var dayData = data.properties.timeseries.filter(function(item){
        return item.time.substring(0, 10) == day;
      })
      return dayData;
    }

    // Get the next (hours) icons and put all into a array
    var weatherIconTop = (d) => {
      for(var i = 0; i < separateDay(d).length; i++){
        // var next1 = separateDay(d)[i].data.next_1_hours.summary.symbol_code;
        var next6 = separateDay(d)[i].data.next_6_hours.summary.symbol_code;
        var next12 = separateDay(d)[i].data.next_12_hours.summary.symbol_code;
        return [next6, next12];
      }
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



        // Set path to weather icon
        var svgPathCurrent = "../svg/" + weatherIcon(1) + ".svg";
        // Set weather icon
        $("#weatherIcon").attr("src", svgPathCurrent);

        // Set path to weather icon
        var svgPathNextHour = "../svg/" + weatherIcon(2) + ".svg";
        // Set weather icon
        $("#weatherIconNextHour").attr("src", svgPathNextHour);


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
                title: 'Været utover dagen'
              }],
            data: [{
              date: 'I dag ' + getDate(dataCurrent)[1] + '. ' + getDate(dataCurrent)[2],
              maxMin: maxMin(dataCurrent)[0] + "° / " + maxMin(dataCurrent)[1] + "°",
              windMax: windDate(dataCurrent) + " m/s",
              weatherIcon: "<img src='../svg/" + weatherIconTop(dataCurrent)[0] + ".svg' height='50' width='50'></img><img src='../svg/" + weatherIconTop(dataCurrent)[1] + ".svg' height='50' width='50'></img>"
            }, {
              date: getDate(dataTomorrow)[0] + ' ' + getDate(dataTomorrow)[1] + '. ' + getDate(dataTomorrow)[2],
              maxMin: maxMin(dataTomorrow)[0] + "° / " + maxMin(dataTomorrow)[1] + "°",
              windMax: windDate(dataTomorrow) + " m/s",
              weatherIcon: "<img src='../svg/" + weatherIconTop(dataTomorrow)[0] + ".svg' height='50' width='50'></img><img src='../svg/" + weatherIconTop(dataTomorrow)[1] + ".svg' height='50' width='50'></img>"
            }, {
              date: getDate(dataDayAfterTomorrow)[0] + ' ' + getDate(dataDayAfterTomorrow)[1] + '. ' + getDate(dataDayAfterTomorrow)[2],
              maxMin: maxMin(42)[0] + "° / " + maxMin(42)[1] + "°",
              windMax: windDate(42) + " m/s",
              weatherIcon: "<img src='../svg/" + weatherIconTop(dataDayAfterTomorrow)[0] + ".svg' height='50' width='50'></img><img src='../svg/" + weatherIconTop(dataDayAfterTomorrow)[1] + ".svg' height='50' width='50'></img>"
            }, {
              date: getDate(dataDayAfterTomorrow2)[0] + ' ' + getDate(dataDayAfterTomorrow2)[1] + '. ' + getDate(dataDayAfterTomorrow2)[2],
              maxMin: maxMin(dataDayAfterTomorrow2)[0] + "° / " + maxMin(dataDayAfterTomorrow2)[1] + "°",
              windMax: windDate(dataDayAfterTomorrow2) + " m/s",
              weatherIcon: "<img src='../svg/" + weatherIconTop(dataDayAfterTomorrow2)[0] + ".svg' height='50' width='50'></img><img src='../svg/" + weatherIconTop(dataDayAfterTomorrow2)[1] + ".svg' height='50' width='50'></img>"
            }, {
              date: getDate(dataDayAfterTomorrow3)[0] + ' ' + getDate(dataDayAfterTomorrow3)[1] + '. ' + getDate(dataDayAfterTomorrow3)[2],
              maxMin: maxMin(dataDayAfterTomorrow3)[0] + "° / " + maxMin(dataDayAfterTomorrow3)[1] + "°",
              windMax: windDate(dataDayAfterTomorrow3) + " m/s",
              weatherIcon: "<img src='../svg/" + weatherIconTop(dataDayAfterTomorrow3)[0] + ".svg' height='50' width='50'></img><img src='../svg/" + weatherIconTop(dataDayAfterTomorrow3)[1] + ".svg' height='50' width='50'></img>"
            }, {
              date: getDate(dataDayAfterTomorrow4)[0] + ' ' + getDate(dataDayAfterTomorrow4)[1] + '. ' + getDate(dataDayAfterTomorrow4)[2],
              maxMin: maxMin(dataDayAfterTomorrow4)[0] + "° / " + maxMin(dataDayAfterTomorrow4)[1] + "°",
              windMax: windDate(dataDayAfterTomorrow4) + " m/s",
              weatherIcon: "<img src='../svg/" + weatherIconTop(dataDayAfterTomorrow4)[0] + ".svg' height='50' width='50'></img><img src='../svg/" + weatherIconTop(dataDayAfterTomorrow4)[1] + ".svg' height='50' width='50'></img>"
            }, {
              date: getDate(dataDayAfterTomorrow5)[0] + ' ' + getDate(dataDayAfterTomorrow5)[1] + '. ' + getDate(dataDayAfterTomorrow5)[2],
              maxMin: maxMin(dataDayAfterTomorrow5)[0] + "° / " + maxMin(dataDayAfterTomorrow5)[1] + "°",
              windMax: windDate(dataDayAfterTomorrow5) + " m/s",
              weatherIcon: "<img src='../svg/" + weatherIconTop(dataDayAfterTomorrow5)[0] + ".svg' height='50' width='50'></img><img src='../svg/" + weatherIconTop(dataDayAfterTomorrow5)[1] + ".svg' height='50' width='50'></img>"
            }, {
              date: getDate(dataDayAfterTomorrow6)[0] + ' ' + getDate(dataDayAfterTomorrow6)[1] + '. ' + getDate(dataDayAfterTomorrow6)[2],
              maxMin: maxMin(dataDayAfterTomorrow6)[0] + "° / " + maxMin(dataDayAfterTomorrow6)[1] + "°",
              windMax: windDate(dataDayAfterTomorrow6) + " m/s",
              weatherIcon: "<img src='../svg/" + weatherIconTop(dataDayAfterTomorrow6)[0] + ".svg' height='50' width='50'></img><img src='../svg/" + weatherIconTop(dataDayAfterTomorrow6)[1] + ".svg' height='50' width='50'></img>"
            }]
          })
    });
});