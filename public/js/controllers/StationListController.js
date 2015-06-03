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
                    
                    var resultImage = new Image();
                    resultImage.src = "images/check-symbol-green.png";
                    resultImage.className = "selection";
                    if(chevronKey[ans]) {
                        var chevron = document.getElementsByClassName("chevron")[0];
                        chevron.appendChild(resultImage);
                    } else {
                        var shell = document.getElementsByClassName("shell")[0];
                        shell.appendChild(resultImage);
                    }
                    //
                    //// route to gas station list
                    //
                    
                    setTimeout(function() {
                        $scope.$apply(function() {
                            recognizer.stop();
                            $location.path("/");     
                        }); 
                    }, 2000);
                }
            });
        }
    };

    $scope.listen = function() {
        console.log('listening');
        recognizer.start();
    };

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
