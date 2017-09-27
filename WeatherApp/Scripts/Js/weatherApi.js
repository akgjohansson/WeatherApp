function BuildURL(entryPoint, longitude, latitude) {
    var output = entryPoint;
    var checkForEndSlash = /\/$/;
    if (!checkForEndSlash.test(entryPoint))
        output += '/';
    output += `api/category/${category}/version/${version}/geotype/point/lon/${longitud}/lat/${latitude}/data.json`;
    return output;
}

var entryPoint = "https://opendata-download-metfcst.smhi.se";
var url = BuildURL(entryPoint, longitude, latitude);
$("#getWeather").click(function () {
    $.getJSON(url, function (data) {
        console.log(data.t);
        //location = GetLocation(data.)
        //$("#weatherText").html(`Nu är det ${data.t} grader i ${location}`)
    });
});

