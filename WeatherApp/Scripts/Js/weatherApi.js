function BuildURL(entryPoint, longitude, latitude) {
    var output = entryPoint;
    var checkForEndSlash = /\/$/;
    var category = "pmp3g";
    var version = 2;
    if (!checkForEndSlash.test(entryPoint))
        output += '/';
    output += `api/category/${category}/version/${version}/geotype/point/lon/${longitude}/lat/${latitude}/data.json`;
    return output;
}

function GetTemperature(data, time) {
    console.log("here");
    console.log(data.timeSeries.length);
    for (var i = 0; i < data.timeSeries.length; i++) {
        console.log(data.timeSeries[i].parameters[12]);
    }
}

var entryPoint = "https://opendata-download-metfcst.smhi.se";
var longitude;
var latitude;
var date = new Date("2017-09-27 14:00");
longitude = 11;
latitude = 58;
var url = BuildURL(entryPoint, longitude, latitude);


$("#getWeather").click(function () {
    $.getJSON(url, function (data) {
        GetTemperature(data , date);
        //console.log(data.timeSeries[0].parameters[10].name);
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

