angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('MapController', function($scope, $ionicLoading) {
 

        var myLatlng = new google.maps.LatLng(37.3000, -120.4833);
 
        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            streetViewControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
 
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
 
        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
            });
        });
 
        $scope.map = map;

 
})

.controller('PlannerController', function($scope, $ionicLoading) {
     $.getJSON("http://www3.septa.org/hackathon/TrainView/", function(data) {
            console.log(data); // use data as a generic object 
      });
 

        //Put your code here for planner stuff
 
})

.controller('NextTrainController', function($scope, $ionicLoading) {
 
	var onSuccess = function(position) {
		document.getElementById("lat").innerHTML = position.coords.latitude;
		document.getElementById("lon").innerHTML = position.coords.longitude;
		
		$.getJSON( "http://www3.septa.org/hackathon/locations/get_locations.php?lon="+position.coords.longitude+"&lat="+position.coords.latitude+"&callback=?", function( data ) {
	  	var items = [];
	  	$.each(data, function( location_id, location_obj) {
	  		console.log(location_obj.location_name);
			items.push("ID: "+location_obj.location_id+", name: "+location_obj.location_name+", lat: "+location_obj.location_lat+", lon: "+location_obj.location_lon+", distance: "+location_obj.distance+", location_type: "+location_obj.location_type+", extra_data: "+location_obj.location_data);
		});
	 
		//console.log(items);
		});
	};

	function onError(error) {
	    alert('You got a geolocation error tho: '    + error.code    + '\n' +
	          'message: ' + error.message + '\n');
	}
	
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
      
	  
});
