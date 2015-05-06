'use strict';
//(function() {

    var app = angular.module("vroomApp", ["ngRoute"]);

    app.config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: 'partials/loading',
                controller: MainController
            })
            .when("/main", {
                templateUrl: "main.html",
                controller: "MainController"
            })
            .when("/test", {
                templateUrl: "test.html",
                controller: "TestController"
            })
            .otherwise({redirectTo: "/"}); 
    });

//}());
