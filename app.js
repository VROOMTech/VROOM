//////////// modules ///////////////
var express     = require('express');
var stylus      = require('stylus');
var nib         = require('nib');
var bodyParser  = require('body-parser');
var app         = express();

///////////// port /////////////////
var port = process.env.PORT || 8080;

//////////// logger ////////////////
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

///////// Jade and Stylus //////////
function compile (str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib());
}
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(stylus.middleware(
    {
        src: __dirname + '/public',
        compile: compile
    }        
));
app.use(express.static(__dirname + '/public'));

///////// http requests ////////////
app.get('/', function (req, res) {
    //res.send('<h1>VROOM VROOM!</h1>');
    res.render('index', 
        {title: 'VROOM'});
});

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('VROOMin at http://%s:%s', host, port);
});
