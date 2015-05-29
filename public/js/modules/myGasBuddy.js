(function() {
    var myGasBuddy = function() {

        var getNearbyGasStations = function(lat, lng, dist, fuelType, sortBy) {
            return $http.get("https://api.mygasfeed.com/stations/radius/" + lat + "/" + lng + "/" + dist + "/" + fuelType + "/" + sortBy + "/apikey.json")
                        .then(function(response) {
                            return response.data;
                        });
        };

        var getGasStationDetails = function(stationId) {
            return $http.get("https://api.mygasfeed.com/stations/details/" + stationId + "/apikey.json")

            .then(function(response) {
                return response.data;
            });
        };

        return {
            getNearbyGasStations: getNearbyGasStations,
            getGasStationDetails: getGasStationDetails
        };
    };
}());
