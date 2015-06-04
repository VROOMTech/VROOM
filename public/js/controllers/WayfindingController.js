var app = angular.module('vroomApp');

var WayfindingController = function($scope, $interval, $location) {
    var initial_value = 35;
    var secondGauge = loadCarGauge("test-gauge", initial_value, null); // jshint ignore:line
    secondGauge.updateGauge(initial_value);

    var alertImage = new Image();
    alertImage.src = 'images/alert-icon-green.png';
    alertImage.className = "alert";

    var statusContainer =  document.getElementsByClassName("status-container")[0];
    statusContainer.appendChild(alertImage);


    var decrementCountdown = function() {
        $scope.countdown -= 1;
        if($scope.countdown < 1) {
            $scope.start();
        }
    };   

    var countdownInterval = null;
    var startCountdown = function() {
        countdownInterval = $interval(decrementCountdown, 1000, $scope.countdown);
    };
        
    $scope.start = function() {
        if(countdownInterval) {
            $interval.cancel(countdownInterval);
            $scope.countdown = null;
        }
        $location.path("/");
    };

    $scope.countdown = 15;
    startCountdown();
};

app.controller("WayfindingController", WayfindingController);
