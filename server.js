//////////// modules ///////////////
var express     = require('express');
var stylus      = require('stylus');
var nib         = require('nib');
var bodyParser  = require('body-parser');
var app         = express();
var routes      = require('./routes');
var https       = require('https');
var fs          = require('fs');
var key         = fs.readFileSync('./vroom-key.pem');
var cert        = fs.readFileSync('./vroom-cert.pem');

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
        {title: 'Test page Vroom'});
    
});

//app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

app.get('/test', function(req, res) {
    res.send('<h1>VROOM VRM!</h1>');
});

//app.get('*', routes.index);

//var server = app.listen(port, function () {
//    var host = server.address().address;
//    var port = server.address().port;
//    console.log('VROOMin at http://%s:%s', host, port);
//});
//
var options = {
    key: key,
    cert: cert
};

https.createServer(options, app).listen(port);
console.log('VROOMin at port 8080');
