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
    var time = $("#hour").val();
    console.log(`${day}${time}`);
    console.log(day);
    console.log(time);
    var output = new Date(`${day}${time}`)
    console.log(output);
    return output;
}

function FormatText(temperature , date) {
    $("#weatherText").html(`Temperaturen kl`)
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
        FormatTempText(temperature , date);
    });
});

