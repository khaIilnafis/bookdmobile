/**
 * Created by khalilbrown on 7/18/16.
 */
'user strict';

module.exports = function ($scope, businessFactory, search, locationFactory, $ionicPopup) {
  var vm = this;
  vm.loading = false;
  vm.query = {
    location: null,
    term: null
  };

  if (navigator.geolocation) {
    locationFactory.checkLocationAvailable().then(function (isEnabled) {
      if (!isEnabled) {
        var confirmPopup = $ionicPopup.confirm({
          title: 'Enable GPS',
          template: 'Please enable high accuracy location tracking.'
        });

        confirmPopup.then(function (res) {
          if (res) {
            cordova.plugins.diagnostic.switchToLocationSettings();
          } else {
            //TODO Prompt for address
          }
        });
      }
    });

    navigator.geolocation.getCurrentPosition(function (position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;

      // This returns an 8 part array where the 0th index is the most accurate and the 7th is least accurate.
      search.getLocationInfo(lat, lng).then(
        function (data) {
          vm.query.location = data['results'][0]['formatted_address'];
        }, function (err) {
          console.log(err);
        });
    }, function (err) {
      console.log(err);
    });
  } else {
    //TODO HANDLE THIS CASE
    console.log('Geolocation is not supported by this browser.');
  }

  vm.search = function () {
    var formattedQuery;
    formattedQuery = vm.query.term + ' ' + vm.query.location;
    vm.loading = true;
    businessFactory.search(formattedQuery)
      .then(function (data) {
        vm.loading = false;
        vm.locations = data;
      });
  };
};