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
            .when("/confirm-location", {
                templateUrl: 'partials/confirm-location',
                controller: ConfirmLocationController
            })
            .when("/station-list", {
                templateUrl: 'partials/station-list',
                controller: StationListController
            })
            .when("/select-fuel-type", {
                templateUrl: 'partials/select-fuel-type',
                controller: SelectFuelTypeController
            })
            .when("/wayfinding", {
                templateUrl: 'partials/wayfinding',
                controller: WayfindingController
            })
            .otherwise({redirectTo: "/"});
    });

}());
