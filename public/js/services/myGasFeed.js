(function() {
    var myGasFeed = function($http) {

        var getNearbyGasStations = function(lat, lng, dist, fuelType, sortBy) {
            return $http.get("https://api.mygasfeed.com/stations/radius/" 
                + lat + "/" 
                + lng + "/" 
                + dist + "/" 
                + fuelType + "/" 
                + sortBy 
                + "/apikey.json")
                        .then(function(response) {
                            return response.data;
                        });
        };

        var getGasStationDetails = function(stationId) {
            return $http.get("http://api.mygasfeed.com/stations/details/" 
                + stationId 
                + "/apikey.json")

            .then(function(response) {
                return response.data;
            });
        };

        return {
            getNearbyGasStations: getNearbyGasStations,
            getGasStationDetails: getGasStationDetails
        };
    };

    var module = angular.module("vroomApp");
    module.factory("myGasFeed", myGasFeed);
}());
