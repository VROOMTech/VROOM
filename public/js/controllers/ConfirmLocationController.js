var app = angular.module('vroomApp');

var ConfirmLocationController = function($scope, $location) {

    var keywords = {"yes": true, 
        "yeah": true, 
        "sure": true, 
        "yup": true};

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
                        $location.path("/select-fuel-type");   
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

    $scope.getUserLocation = function() {
        var x = document.getElementsByClassName("footer")[0];

        if(navigator.geolocation) {
            console.log("geolocation available");
            navigator.geolocation.getCurrentPosition(getAddress);
        }else {
            console.log('geolocation not available');
        }

        function getAddress(position) {
            console.log('received lat long');
            x.innerHTML = "Latitude: " + position.coords.latitude +
                "<br>Longitude: " + position.coords.longitude;

            var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); // network pull
            
            console.log(latlng);

            geocoder = new google.maps.Geocoder();
            geocoder.geocode({'latLng': latlng}, function(results, status) {
                if(status == google.maps.GeocoderStatus.OK) {
                    console.log('received some data');
                    console.log(results[1].formatted_address);
                }
            });
        };
    };
    $scope.getUserLocation();
};

app.controller("ConfirmLocationController", ConfirmLocationController);
