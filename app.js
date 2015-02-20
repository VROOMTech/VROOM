//////////// modules ///////////////
var express = require('express');
var app = express();

///////////// port /////////////////
var port = process.env.PORT || 8080;
///////// http requests ////////////
app.get('/', function (req, res) {
    res.send('<h1>VROOM VROOM!</h1>');
});

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('VROOMin at http://%s:%s', host, port);
});
