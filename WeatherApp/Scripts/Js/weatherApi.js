function BuildURL(entryPoint, longitude, latitude) {
    //var dateString = `${date.year}${date.month}${date.day}${date.hour}${date.minute}${date.second}Z`;
    var output = entryPoint;
    var checkForEndSlash = /\/$/;
    var category = "pmp3g";
    var version = 2;
    var levelType = "hl";
    if (!checkForEndSlash.test(entryPoint))
        output += '/';
    output += `api/category/${category}/version/${version}/geotype/point/lon/${longitude}/lat/${latitude}/data.json`;

    //output += `api/category/${category}/version/${version}/geotype/multipoint/validtime/${dateString}/parameter/t/leveltype/${levelType}/level/2/data.json?with-geo=false&downsample=2`;
    return output;
}

function GetNearestTimePoing(timeSeries , date) {
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

function GetTempIndex(timeSeries) {
    for (var i = 0; i < timeSeries[0].length; i++) {
        if (timeSeries[0][i].name == "t")
            return i;
    }
}

function GetTemperature(data, time) {
    console.log("here");
    console.log(data.timeSeries.length);
    var tempIndex = GetTempIndex(data.timeSeries);
    for (var i = 0; i < data.timeSeries.length; i++) {
        console.log(data.timeSeries[i].parameters[0]);
    }
}

var entryPoint = "https://opendata-download-metfcst.smhi.se";
var longitude;
var latitude;
var date = new Date("2017-09-28 14:00");
longitude = 11;
latitude = 58;
var url = BuildURL(entryPoint, longitude, latitude);


$("#getWeather").click(function () {
    $.getJSON(url, function (data) {
        GetTemperature(data, date);
        var index = GetNearestTimePoing(data.timeSeries, date);
        console.log(data.timeSeries[0]);
        console.log(index);
        //$.each(data, function (key, val) {
        //    console.log(key);
        //    //if (key == "timeSeries") {
        //    //    $.each(key, function (key1, val1) {
        //    //        console.log(key1);
        //    //        console.log(val1);
        //    //    });
        //    //}
        //    console.log(val);
        //});
        //console.log(data.);
        //location = GetLocation(data.)
        //$("#weatherText").html(`Nu är det ${data.t} grader i ${location}`)
    });
});

