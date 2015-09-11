'use strict';
var app = angular.module('vroomApp');

var dependencies = [
    '$location',
    '$scope',
    '$timeout'
];

function ConfirmLocationController($location, $scope, $timeout) {
    $scope.address = "";
    $scope.isListening = false;

    $scope.getUserLocation = function() {
        var x = document.getElementsByClassName("footer")[0];

        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(getAddress);
        }else {
            console.error('geolocation not available');
        }

        function getAddress(position) {
            var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); // network pull

            geocoder = new google.maps.Geocoder();
            geocoder.geocode({'latLng': latlng}, function(results, status) {
                if(status == google.maps.GeocoderStatus.OK) {
                    $scope.address = results[1].formatted_address;
                    $scope.$apply();
                }
            });
        };
    };
    $scope.getUserLocation();

    var keywords = {"yes": true,
        "yeah": true,
        "sure": true,
        "yup": true};

    var recognizer = new webkitSpeechRecognition(); // jshint ignore:line
    recognizer.onstart = function() {
        $scope.isListening = true;
        var foot = document.getElementsByClassName('footer')[0];
        var h1 = document.createElement("span");
        h1.className = 'speak-now';
        var text = document.createTextNode("speak now");
        h1.appendChild(text);
        foot.appendChild(h1);


        $scope.shrinkMic();
        console.log('speech started');
    };

    recognizer.onend = function() {
        $scope.isListening = false;
        console.log('speech ended');
        var footer = document.getElementsByClassName('footer')[0];
        var speakLabel = document.getElementsByClassName('speak-now')[0];
        console.log(speakLabel);
        footer.removeChild(speakLabel);

    };
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
                        recognizer.stop();
                        $location.path("/select-fuel-type");
                    });

                }
            });
        }
    };

    var micToggle = true;
    var micIsBig = micToggle ? "mic-icon big" : "mic-icon small";

    $scope.animateMic = function() {
        micToggle = !micToggle;
        micIsBig = micToggle ? "mic-icon big" : "mic-icon small";
        var mic = document.getElementsByClassName('mic-icon')[0];
        mic.className = micIsBig;
    };

    $scope.enlargeMic = function() {
        if($scope.isListening) {
            $scope.animateMic();
            $timeout(function() {
                $scope.shrinkMic();
            }, 600);
        }
    };

    $scope.shrinkMic = function() {
        if($scope.isListening) {
            $scope.animateMic();
            $timeout(function() {
                $scope.enlargeMic();
            }, 600);

        }
    };

    $scope.listen = function() {
        if($scope.isListening) {
            $scope.isListening = false;
            recognizer.stop();
        }
        recognizer.start();
    };

    $scope.activate = function() {
        $scope.listen();
    };

};

ConfirmLocationController.$inject = dependencies;

app.controller("ConfirmLocationController", ConfirmLocationController);
