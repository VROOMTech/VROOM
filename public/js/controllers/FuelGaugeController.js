var app = angular.module('vroomApp');

var FuelGaugeController = function($scope, $location) {

    // test gauge value
    var initial_value = 60;
    var firstGauge = loadCarGauge("test-gauge", initial_value, null);
    firstGauge.updateGauge(initial_value);
    var recommendedRefuelValue = firstGauge.getRecommendedRefuelValue();

    var value = 123;
    var timer = null;
    var shouldRefuel = false;
    var consuming = null;

    var drain = function() {
        if(value === 0) {
            clearInterval(timer);
        } else if(value <= recommendedRefuelValue) {
            clearInterval(timer); 
            timer = setInterval(drain, 25000);
        } else {
            value = firstGauge.getGaugeValue();
            value = value - 1;
            firstGauge.updateGauge(value);
            if(!shouldRefuel && value <= recommendedRefuelValue) {
                shouldRefuel = true;
                console.log("need to refuel noww!"); 
                document.getElementsByClassName("status")[0].src = "images/alert-icon.png";
                var h1 = document.createElement("h1");
                h1.appendChild(document.createTextNode("You Should Refuel"));
                document.getElementsByClassName("status-container")[0].appendChild(h1);
            }
        }
    };

    var gain = function() {
        if(value === 100) {
            clearInterval(timer);
        } else {
            value = firstGauge.getGaugeValue();
            value = value + 1;
            firstGauge.updateGauge(value);
            if(shouldRefuel && value > recommendedRefuelValue) {
                shouldRefuel = false;
                console.log("you're good now!"); 
                document.getElementsByClassName("status")[0].src = "images/check-symbol.png";
            }
        }
    };

    $scope.burnRubber = function() {
        if(timer) {
            clearInterval(timer);
            timer = null;
            consuming = null;
        }
        consuming = true;
        timer = setInterval(drain, 1000);
    };

    $scope.burnRubber();

    $scope.refuel = function() {
        if(timer) {
            clearInterval(timer);
            timer = null;
            consuming = null;
        }
        consuming = false;
        timer = setInterval(gain, 50);
    };

    $scope.turnCarOff = function() {
        if(timer) {
           clearInterval(timer); 
           timer = null;
        }
    };

    var keywords = {"gas": true, "fuel": true, "where": true, "gage": true, "gauge": true, "near": true, "nearest": true, "find": true, "around": true, "locate": true, "refuel": true, "pump": true, "refill": true, "tank": true, "jewel": true, "station": true, "bump": true, "you'll": true};

    var recognizer = new webkitSpeechRecognition();
    recognizer.continuous = true;
    recognizer.interimResults = true;
    recognizer.lang = "en";
    recognizer.onresult = function(e) {
        if(e.results.length) {
            var lastResultIndex = e.results.length - 1;
            var words = e.results[lastResultIndex][0].transcript.split(" ");
            $scope.receivedWords = words[words.length - 1];
            console.log('words is: ' + words);
            //words.forEach(function(element, index, array) {
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

};

app.controller("FuelGaugeController", FuelGaugeController);
