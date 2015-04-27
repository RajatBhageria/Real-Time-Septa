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
        
        var styles = [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}];
 
        var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});
        
        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            streetViewControl: false,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
 
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        
        map.mapTypes.set('map_style', styledMap);
		map.setMapTypeId('map_style');
 
 		var regLayer = new google.maps.KmlLayer({
    		url: 'http://www.chanmatt.me/regionalrail.kml'
  		});
  		regLayer.setMap(map);
		
		var bsllayer = new google.maps.KmlLayer({
    		url: 'http://www.chanmatt.me/bsl.kml'
  		});
  		bsllayer.setMap(map);
		
		var mfllayer = new google.maps.KmlLayer({
    		url: 'http://www.chanmatt.me/mfl.kml'
  		});
  		mfllayer.setMap(map);
 
        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
            });
        });
 
        $scope.map = map;


       //Update the location of the individual trains 
       var car; 
       var x = function() {$.getJSON("http://www3.septa.org/hackathon/TrainView?callback=?", function(data) {
            console.log(data); // use data as a generic object 
            $.each(data, function(id, obj) {
              var lat = obj.lat;
              var lon = obj.lon;
              var trainno = obj.trainno; 
              console.log("lat: " + lat + ";" + "lon: " + lon);
              
              var pic = 'https://cdn3.iconfinder.com/data/icons/vehicles-and-transportation-icon-set/434/locomotive-simple-black-icon-512.png';
              car = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lon),
                map: map,
                title: trainno,
                //icon: pic
              }); 
               var delay=1000;//1 seconds
                setTimeout(function(){
                  car.setMap(null);
                  setAllMap(null);
                }, delay); 
            });
        });

      }

      setInterval(x, 1000); 



 
})

.controller('PlannerController', function($scope, $ionicLoading) {

    $.getJSON("http://www3.septa.org/hackathon/TrainView/", function(data) {
    	console.log(data); // use data as a generic object 
    });

	//Put your code here for planner stuff
	$('#plan').click(function(){
    	alert( "Destination: " + $( "#destination option:selected" ).text());
	});

})

.controller('NextTrainController', function($scope, $ionicLoading) {
	var onSuccess = function(position) {
		getYourRailStation(position);
	};

	var radius = 20;
	
	function getYourRailStation(position) {
		$.getJSON( "http://www3.septa.org/hackathon/locations/get_locations.php?lon="+position.coords.longitude+"&lat="+position.coords.latitude+"&type=rail_stations&radius="+radius+"&callback=?", function( data ) {
			var closest_station = data[0].location_name;
			$("#next_train_header span").html(closest_station);
			
			$.ajax({
			    url: "http://www3.septa.org/hackathon/Arrivals/"+closest_station+"/5?callback=?",
			    dataType: 'JSONP',
			    jsonp: false,
			    jsonpCallback: 'callback',
			    type: 'GET',
			    success: function (data) {
			        console.log(data);
			        document.getElementById("locations").innerHTML = data;
			    },
			    error: function () {
			    	document.getElementById("locations").innerHTML = "We cannot get the next train right now, sorry!";
			    }
			});

		});
	};

	function onError(error) {
	    alert('You got a geolocation error tho: '    + error.code    + '\n' +
	          'message: ' + error.message + '\n');
	}
	
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
      
	  
});
