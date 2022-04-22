$.getJSON("https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=67.28&lon=14.405&altitude=11", function(data){
    
    console.log(data);

    var currentWeather = data.properties.timeseries[2].data.instant.details;
    console.log(currentWeather);

});



// 2 is current time