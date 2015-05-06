'use strict';
(function() {

    var app = angular.module("vroomApp", ["ngRoute"]);

    app.config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: 'partials/loading',
                controller: MainController
            })
            .when("/fuel-gauge", {
                templateUrl: 'partials/fuel-gauge',
                controller: FuelGaugeController
            })
            .when("/test", {
                templateUrl: "test.html",
                controller: "TestController"
            })
            .otherwise({redirectTo: "/"}); 
    });

}());
