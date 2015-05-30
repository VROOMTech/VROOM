var app = angular.module('vroomApp');

var StationListController = function($scope, $location, myGasFeed, testGasFeed) {

    var keywords = {"chevron": true, 
        "shell": true, 
        "cheap": true, 
        "cheapest": true, 
        "close": true, 
        "closest": true, 
        "near": true, 
        "nearest": true};


    var chevronKey = {"chevron": true,
        "Chevron": true,
        "cheap": true,
        "cheapest": true};

    var shellKey = {"shell": true,
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
                var ans = element.toLowerCase();
                console.log(ans + ' in keywords is ' + keywords[element]);
                if(keywords[ans]) {
                    console.log(ans + " was said"); 
                    
                    if(chevronKey[ans]) {
                        document.getElementsByClassName("chevron-image")[0].src = "images/check-symbol_green.png"; 
                    } else {
                        document.getElementsByClassName("shell-image")[0].src = "images/check-symbol_green.png";
                    }
                    // route to gas station list
                    //
                    
                    setTimeout(function() {
                        $scope.$apply(function() {
                            recognizer.stop();
                            $location.path("/fuel-gauge-update");     
                        }); 
                    }, 2000);

                    //$scope.$apply(function() {
                    //    $location.path("/fuel-gauge");   
                    //    recognizer.stop();
                    //});

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

    //myGasFeed.getNearbyGasStations(latitude, longitude, 3, 'reg', 'price')
    //    .then(onGetNearbyGasStationsComplete, onError);
    
    var gasStationDataPrice = testGasFeed.getNearbyGasStationsByPrice();
    var gasStationDataDistance = testGasFeed.getNearbyGasStationsByDistance();
    //gasStationData.stations.forEach(function(station) {
    //    console.log(station);
    //});
    //

    $scope.cheapestStation = gasStationDataPrice.stations[0].station;
    $scope.cheapestPrice = gasStationDataPrice.stations[0].reg_price;
    $scope.cheapestDistance = gasStationDataPrice.stations[0].distance;
    $scope.closestStation = gasStationDataDistance.stations[2].station;
    $scope.closestPrice = gasStationDataDistance.stations[2].reg_price;
    $scope.closestDistance = gasStationDataDistance.stations[2].distance;

    console.log(gasStationDataPrice.stations[0].station);
    console.log(gasStationDataPrice.stations[0].reg_price);
    console.log(gasStationDataPrice.stations[0].distance);
    console.log(gasStationDataDistance.stations[2].station);
    console.log(gasStationDataDistance.stations[2].reg_price);
    console.log(gasStationDataDistance.stations[2].distance);



};

app.controller("StationListController", StationListController);
