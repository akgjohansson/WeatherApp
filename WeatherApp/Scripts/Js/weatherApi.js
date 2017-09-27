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

function GetWeatherParam(data, time , latitude , longitude , paramName) {
    var timeIndex = GetNearestTimePoint(data.timeSeries, date);
    var paramIndex = GetParameterIndex(data.timeSeries[timeIndex].parameters, paramName);
    console.log(paramIndex);
    return data.timeSeries[timeIndex].parameters[paramIndex].values[0];
}

function GetCoordinates() {
    var input = $("#latlng").val()
    console.log(input);
    console.log(input.split(','));
    var output = input.split(',');
    return [output[0].trim(), output[1].trim()];

}

var entryPoint = "https://opendata-download-metfcst.smhi.se";
var longitude;
var latitude;
var date = new Date("2017-09-28 14:00");
longitude = 11;
latitude = 58;


$("#getWeather").click(function () {
    var coordinates = GetCoordinates();
    var url = BuildURL(entryPoint, coordinates[0], coordinates[1]);
    $.getJSON(url, function (data) {
        var temperature = GetWeatherParam(data, date, longitude, latitude , 't');
        console.log(`Temperaturen är ${temperature} grader celsius`)
        //FormatTempText(temperature);
    });
});

