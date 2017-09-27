function BuildURL(entryPoint, longitude, latitude) {
    //var dateString = `${date.year}${date.month}${date.day}${date.hour}${date.minute}${date.second}Z`;
    var output = entryPoint;
    var checkForEndSlash = /\/$/;
    var category = "pmp3g";
    var version = 2;
    var levelType = "hl";
    if (!checkForEndSlash.test(entryPoint))
        output += '/';
    //output += `api/category/${category}/version/${version}/geotype/point/lon/15.5/lat/58.13333333333333/data.json`;
    output += `api/category/${category}/version/${version}/geotype/point/lon/${longitude}/lat/${latitude}/data.json`;

    //output += `api/category/${category}/version/${version}/geotype/multipoint/validtime/${dateString}/parameter/t/leveltype/${levelType}/level/2/data.json?with-geo=false&downsample=2`;
    return output;
}

function GetNearestTimePoint(timeSeries , date) {
    var nearestIndex;
    var leastTimeDifference;
    for (var i = 0; i < timeSeries.length; i++) {
        var validTime = new Date(timeSeries[i].validTime);
        var timeDifference = Math.abs(date.getTime() - validTime);
        if (i == 0) {
            leastTimeDifference = timeDifference;
            nearestIndex = i;
        }
    
        if ((i == 0) || (timeDifference < leastTimeDifference)) {
            leastTimeDifference = timeDifference;
            nearestIndex = i;
        }
    }
    return nearestIndex;
}

function GetParameterIndex(parameters , paramName) {
    console.log("inne i tempIndex");
    console.log(parameters);
    for (var i = 0; i < parameters.length; i++) {
        console.log(parameters[i].name);
        console.log(paramName);
        if (parameters[i].name.toLowerCase() == paramName.toLowerCase()) {
            return i;
        }
    }
    return null;
}

function GetDate() {
    var day = $("#date").val();
    var time = $("#time").val();
    var splitTime = time.split(':');
    if (splitTime[1] >= 30){
        splitTime[0] = parseInt(splitTime[0]) + 1;
    }
    var output = new Date(`${day} ${splitTime[0]}:00`)
    return output;
}

function FormatText(temperature, date) {
    var months = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];
    $("#weatherDescription").html(`Temperaturen kl ${date.getHours()} den ${date.getDate()} ${months[date.getMonth()]} är`);
    $("#weatherText").html(`${temperature} °C`);
    $("#cold").html("");
    $("#warm").html("");
    $("#tooHot").html("");
    if (temperature < 15) {
        $("#cold").html("http://nerdist.com/wp-content/uploads/2015/08/Cold-Weather-Movies-082215.jpg");
    }
    else if (temperature >= 15 < 25) {
        $("#warm").html("http://invisiblebread.com/comics-firstpanel/2014-05-08-nice-weather.png");
    } else{
        $("#tooHot").html("http://worldartsme.com/images/too-hot-weather-clipart-1.jpg");
    }

}

function GetWeatherParam(data, time , latitude , longitude , paramName , date) {
    var timeIndex = GetNearestTimePoint(data.timeSeries, date);
    var paramIndex = GetParameterIndex(data.timeSeries[timeIndex].parameters, paramName);
    return data.timeSeries[timeIndex].parameters[paramIndex].values[0];
}

function GetCoordinates() {
    var input = $("#latlng").val()
    var output = input.split(',');
    for (var i = 0; i < 2; i++) {
        if (output[i].length >= 5)
            output[i] = output[i].substr(0, 5);
    }
    return [output[1].trim(), output[0].trim()];

}

var entryPoint = "https://opendata-download-metfcst.smhi.se";
longitude = 11;
latitude = 58;


$("#getWeather").click(function () {
    var coordinates = GetCoordinates();
    var date = GetDate();
    var url = BuildURL(entryPoint, coordinates[0], coordinates[1]);
    $.getJSON(url, function (data) {
        var temperature = GetWeatherParam(data, date, longitude, latitude , 't' , date);
        FormatText(temperature , date);
    });
});

