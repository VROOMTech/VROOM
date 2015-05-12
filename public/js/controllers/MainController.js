var app = angular.module('vroomApp');

var MainController = function($scope, $interval, $location) {
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
        $location.path("/confirm-location");
    };

    $scope.countdown = 5;
    startCountdown();
};

app.controller("MainController", MainController);
