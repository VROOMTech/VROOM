var app = angular.module('vroomApp');

var StationListController = function($scope, $location, myGasFeed) {

    var keywords = {"chevron": true, 
        "shell": true, 
        "cheap": true, 
        "cheapest": true, 
        "close": true, 
        "closest": true, 
        "near": true, 
        "nearest": true};

    var recognizer = new webkitSpeechRecognition(); // jshint ignore:line
    recognizer.continuous = true;
    recognizer.interimResults = true;
    recognizer.lang = "en";
    recognizer.onresult = function(e) {
        if(e.results.length) {
            var lastResultIndex = e.results.length - 1;
            var words = e.results[lastResultIndex][0].transcript.split(" ");
            $scope.receivedWords = words[words.length - 1];
            console.log('words is: ' + words);
            words.forEach(function(element) {
                console.log(element + ' in keywords is ' + keywords[element]);
                if(keywords[element]) {
                    console.log(element + " was said"); 
                    // route to gas station list
                    $scope.$apply(function() {
                        $location.path("/station-list");   
                        recognizer.stop();
                    });

                }
            });
        }
    };

    $scope.listen = function() {
        console.log('listening');
        recognizer.start();
    };

    var places = {};
    var map;
    var dataContainer = document.getElementsByClassName('places-test')[0];
    var latitude = 47.6614244;
    var longitude = -122.2683743;

    places.initialize = function() {
        var latlng = new google.maps.LatLng(latitude, longitude);
        var myOptions = {
            zoom: 14,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementsByClassName('places-test')[0], myOptions);
        places.placesRequest('Gas Stations', latlng, 29000, ['gas_station'], 'images/Oil-Green.png');

    };

    places.placesRequest = function(title, latlng, radius, types, icon) {
        // request params
        var request = {
            location: latlng,
            radius: radius,
            types: types
        };

        // Make a service call to google
        // TODO: need to change map to node
        var callPlaces = new google.maps.places.PlacesService(map);
        callPlaces.search(request, function(results, status) {
            if(status == google.maps.places.PlacesServiceStatus.OK){
                results.forEach(function(element) {
                    console.log(element);
                });  
            }; 
        });
    };

    //places.initialize();
    
    //
    // My Gas Buddy
    //
    
    var onGetNearbyGasStationsComplete = function(data) {
        $scope.gasStations = data;
        data.forEach(function(element){
            console.log(element);
        }); 
    };  

    var onError = function(reason) {
        $scope.error = "Could not fetch gas stations";
    };

    myGasFeed.getNearbyGasStations(latitude, longitude, 3, 'reg', 'price')
        .then(onGetNearbyGasStationsComplete, onError);

};

app.controller("StationListController", StationListController);
