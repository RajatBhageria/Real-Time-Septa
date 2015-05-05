var closest_station = "University City";
var radius = 20;

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
  
  //get current position
  navigator.geolocation.getCurrentPosition(onSuccess, onError);
  
  function onSuccess(position) {
		$.getJSON( "http://www3.septa.org/hackathon/locations/get_locations.php?lon="+position.coords.longitude+"&lat="+position.coords.latitude+"&type=rail_stations&radius="+radius+"&callback=?", function( data ) {
			closest_station = data[0].location_name;
			$("#next_train_header span").html(closest_station);
		});
	}
	
  function onError(error) {
      alert('You got a geolocation error tho: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
	}

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
            streetViewControl: false,
            disableDefaultUI: true,
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
 
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        map.setCenter(new google.maps.LatLng(39.952638, -75.163995), 13); 
        
        map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');
 
    var regLayer = new google.maps.KmlLayer({
        url: 'http://www.chanmatt.me/regionalrail.kml',
        preserveViewport: true
      });
      regLayer.setMap(map);
    
    var bsllayer = new google.maps.KmlLayer({
        url: 'http://www.chanmatt.me/bsl.kml',
        preserveViewport: true
      });
      bsllayer.setMap(map);
    
    var mfllayer = new google.maps.KmlLayer({
        url: 'http://www.chanmatt.me/mfl.kml',
        preserveViewport: true
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

        var markersArray = [];

        function clearCars() {
          for (var i = 0; i < markersArray.length; i++ ) {
            markersArray[i].setMap(null);
          }
          markersArray.length = 0;
        }

        var x = function() {$.getJSON("http://www3.septa.org/hackathon/TrainView?callback=?", function(data) {
          console.log(data); // use data as a generic object 
          clearCars();

          $.each(data, function(id, obj) {
            var lat = obj.lat;
            var lon = obj.lon;
            var trainno = obj.trainno; 
            console.log("lat: " + lat + ";" + "lon: " + lon);
              
            var pic = 'https://toiletmap.gov.au/Images/icons/train.png';
            car = new google.maps.Marker({
              position: new google.maps.LatLng(lat, lon),
              map: map,
              title: trainno,
              icon: pic
              });
            markersArray.push(car); 
            google.maps.event.addListener(car,"click",function(){});
             
            //var delay=1000;//1 second
            //setTimeout(function(){
              //car.setMap(null);
              //setAllMap(null);
              //clearCars;
            //}, delay); 
          });
        });}
        x();
        setInterval(x, 10000);  
})

.controller('PlannerController', function($scope, $ionicLoading) {
 $.getJSON("http://www3.septa.org/hackathon/TrainView/?callback=?", function(data) {
      //console.log(data); // use data as a generic object 
    });


	var pJson = '[ { "Oreland" : [ "North Hills" , "Fort Washington" ] } , { "Ryers" : [ "Cheltenham" , "Fox Chase" ] } , { "Fernwood-Yeadon" : [ "Angora" , "Lansdowne" ] } , { "Airport Terminal C & D" : [ "Airport Terminal B" , "Airport Terminal E & F" ] } , { "Neshaminy Falls" : [ "Trevose" , "Langhorne" ] } , { "Levittown" : [ "Bristol" , "Trenton Transit Center" ] } , { "Crum Lynne" : [ "Ridley Park" , "Eddystone" ] } , { "Queen Lane" : [ "North Philadelphia" , "Chelten Avenue" ] } , { "Suburban Station" : [ "Jefferson Station" , "30th Street Station" ] } , { "Glenolden" : [ "Folcroft" , "Norwood" ] } , { "Fortuna" : [ "Lansdale" , "Colmar" ] } , { "Devon" : [ "Strafford" , "Berwyn" ] } , { "Langhorne" : [ "Neshaminy Falls" , "Woodbourne" ] } , { "Noble" : [ "Jenkintown" , "Rydal" ] } , { "Airport Terminal A" : [ "Eastwick" , "Airport Terminal B" ] } , { "Airport Terminal B" : [ "Airport Terminal A" , "Airport Terminal C & D" ] } , { "Darby" : [ "University City" , "Curtis Park" ] } , { "Wynnewood" : [ "Narberth" , "Ardmore" ] } , { "North Hills" : [ "Glenside" , "Oreland" ] } , { "Holmesburg" : [ "Tacony" , "Torresdale" ] } , { "West Trenton" : [ "Yardley" ] } , { "Overbrook" : [ "30th Street Station" , "Merion" ] } , { "Glenside" : [ "Jenkintown" , "North Hills" , "Ardsley" ] } , { "Highland" : [ "St Martins" , "Chestnut Hill West" ] } , { "Elwyn" : [ "Media" ] } , { "Daylesford" : [ "Berwyn" , "Paoli" ] } , { "Roslyn" : [ "Ardsley" , "Crestmont" ] } , { "Norristown TC" : [ "Conshohocken" , "Main Street" ] } , { "Malvern" : [ "Paoli" , "Exton" ] } , { "Chester" : [ "Eddystone" , "Highland Avenue" ] } , { "Doylestown" : [ "Del Val College" ] } , { "Ardmore" : [ "Wynnewood" , "Haverford" ] } , { "University City" : [ "30th Street Station" , "Eastwick" , "49th Street" , "Darby" ] } , { "Wayne Junction" : [ "Temple University" , "Wister" , "Olney" , "North Broad" , "Fern Rock TC" ] } , { "New Britain" : [ "Chalfont" , "Del Val College" ] } , { "Rosemont" : [ "Bryn Mawr" , "Villanova" ] } , { "Claymont" : [ "Marcus Hook" , "Wilmington" ] } , { "Somerton" : [ "Forest Hills" , "Trevose" ] } , { "Croydon" : [ "Eddington" , "Bristol" ] } , { "Gwynedd Valley" : [ "Penllyn" , "North Wales" ] } , { "Penllyn" : [ "Ambler" , "Gwynedd Valley" ] } , { "Olney" : [ "Wayne Junction" , "Lawndale" ] } , { "Prospect Park" : [ "Norwood" , "Ridley Park" ] } , { "Carpenter" : [ "Upsal" , "Allen Lane" ] } , { "Cynwyd" : [ "Bala" ] } , { "Narberth" : [ "Merion" , "Wynnewood" ] } , { "Radnor" : [ "Villanova" , "St Davids" ] } , { "Yardley" : [ "Woodbourne" , "West Trenton" ] } , { "Secane" : [ "Primos" , "Morton" ] } , { "Gladstone" : [ "Lansdowne" , "Clifton-Aldan" ] } , { "Moylan-Rose Valley" : [ "Wallingford" , "Media" ] } , { "Angora" : [ "49th Street" , "Fernwood-Yeadon" ] } , { "Wilmington" : [ "Claymont" , "Churchmans Crossing" ] } , { "Lawndale" : [ "Olney" , "Cheltenham" ] } , { "Chelten Avenue" : [ "Queen Lane" , "Tulpehocken" ] } , { "Pennbrook" : [ "North Wales" , "Lansdale" ] } , { "Swarthmore" : [ "Morton" , "Wallingford" ] } , { "Sharon Hill" : [ "Curtis Park" , "Folcroft" ] } , { "Highland Avenue" : [ "Chester" , "Marcus Hook" ] } , { "Washington Lane" : [ "Germantown" , "Stenton" ] } , { "Elm Street" : [ "Main Street" ] } , { "Colmar" : [ "Fortuna" , "Link Belt" ] } , { "Norwood" : [ "Glenolden" , "Prospect Park" ] } , { "North Wales" : [ "Gwynedd Valley" , "Pennbrook" ] } , { "Bethayres" : [ "Meadowbrook" , "Philmont" ] } , { "Exton" : [ "Malvern" , "Whitford" ] } , { "Wissahickon TC" : [ "East Falls" , "Manayunk" ] } , { "Ardsley" : [ "Glenside" , "Roslyn" ] } , { "Wyndmoor" : [ "Mount Airy" , "Gravers" ] } , { "Bristol" : [ "Croydon" , "Levittown" ] } , { "Primos" : [ "Clifton-Aldan" , "Secane" ] } , { "Newark" : [ "Churchmans Crossing" ] } , { "Eddington" : [ "Cornwells Heights" , "Croydon" ] } , { "Hatboro" : [ "Willow Grove" , "Warminster" ] } , { "Spring Mill" : [ "Miquon" , "Conshohocken" ] } , { "Allegheny" : [ "North Broad" , "East Falls" ] } , { "Mount Airy" : [ "Sedgwick" , "Wyndmoor" ] } , { "East Falls" : [ "Allegheny" , "Wissahickon TC" ] } , { "Cornwells Heights" : [ "Torresdale" , "Eddington" ] } , { "Clifton-Aldan" : [ "Gladstone" , "Primos" ] } , { "Gravers" : [ "Wyndmoor" , "Chestnut Hill East" ] } , { "Lansdowne" : [ "Fernwood-Yeadon" , "Gladstone" ] } , { "Fern Rock TC" : [ "Wayne Junction" , "Melrose Park" ] } , { "Upsal" : [ "Tulpehocken" , "Carpenter" ] } , { "Marcus Hook" : [ "Highland Avenue" , "Claymont" ] } , { "49th Street" : [ "University City" , "Angora" ] } , { "Elkins Park" : [ "Melrose Park" , "Jenkintown" ] } , { "Cheltenham" : [ "Lawndale" , "Ryers" ] } , { "Melrose Park" : [ "Fern Rock TC" , "Elkins Park" ] } , { "St Davids" : [ "Radnor" , "Wayne" ] } , { "Eastwick" : [ "University City" , "Airport Terminal A" ] } , { "Germantown" : [ "Wister" , "Washington Lane" ] } , { "Morton" : [ "Secane" , "Swarthmore" ] } , { "Philmont" : [ "Bethayres" , "Forest Hills" ] } , { "Berwyn" : [ "Devon" , "Daylesford" ] } , { "Whitford" : [ "Exton" , "Downingtown" ] } , { "Ivy Ridge" : [ "Manayunk" , "Miquon" ] } , { "Airport Terminal E & F" : [ "Airport Terminal C & D" ] } , { "30th Street Station" : [ "Suburban Station" , "University City" , "North Philadelphia" , "Wynnefield Avenue" , "Overbrook" ] } , { "Wynnefield Avenue" : [ "30th Street Station" , "Bala" ] } , { "North Philadelphia" : [ "30th Street Station" , "Queen Lane" , "Bridesburg" ] } , { "Temple University" : [ "Jefferson Station" , "Wayne Junction" , "North Broad" ] } , { "Del Val College" : [ "New Britain" , "Doylestown" ] } , { "Chalfont" : [ "Link Belt" , "New Britain" ] } , { "Media" : [ "Moylan-Rose Valley" , "Elwyn" ] } , { "Merion" : [ "Overbrook" , "Narberth" ] } , { "Chestnut Hill East" : [ "Gravers" ] } , { "Strafford" : [ "Wayne" , "Devon" ] } , { "Fox Chase" : [ "Ryers" ] } , { "Bala" : [ "Wynnefield Avenue" , "Cynwyd" ] } , { "Ambler" : [ "Fort Washington" , "Penllyn" ] } , { "Torresdale" : [ "Holmesburg" , "Cornwells Heights" ] } , { "Forest Hills" : [ "Philmont" , "Somerton" ] } , { "Wallingford" : [ "Swarthmore" , "Moylan-Rose Valley" ] } , { "Chestnut Hill West" : [ "Highland" ] } , { "Jenkintown" : [ "Elkins Park" , "Glenside" , "Noble" ] } , { "Villanova" : [ "Rosemont" , "Radnor" ] } , { "Manayunk" : [ "Wissahickon TC" , "Ivy Ridge" ] } , { "Paoli" : [ "Daylesford" , "Malvern" ] } , { "Fort Washington" : [ "Oreland" , "Ambler" ] } , { "Bridesburg" : [ "North Philadelphia" , "Tacony" ] } , { "Rydal" : [ "Noble" , "Meadowbrook" ] } , { "Wayne" : [ "St Davids" , "Strafford" ] } , { "Trevose" : [ "Somerton" , "Neshaminy Falls" ] } , { "St Martins" : [ "Allen Lane" , "Highland" ] } , { "Meadowbrook" : [ "Rydal" , "Bethayres" ] } , { "Eddystone" : [ "Crum Lynne" , "Chester" ] } , { "Thorndale" : [ "Downingtown" ] } , { "Bryn Mawr" : [ "Haverford" , "Rosemont" ] } , { "Miquon" : [ "Ivy Ridge" , "Spring Mill" ] } , { "Lansdale" : [ "Pennbrook" , "Fortuna" ] } , { "Downingtown" : [ "Whitford" , "Thorndale" ] } , { "Woodbourne" : [ "Langhorne" , "Yardley" ] } , { "Main Street" : [ "Norristown TC" , "Elm Street" ] } , { "Tacony" : [ "Bridesburg" , "Holmesburg" ] } , { "Ridley Park" : [ "Prospect Park" , "Crum Lynne" ] } , { "Folcroft" : [ "Sharon Hill" , "Glenolden" ] } , { "Willow Grove" : [ "Crestmont" , "Hatboro" ] } , { "Haverford" : [ "Ardmore" , "Bryn Mawr" ] } , { "Sedgwick" : [ "Stenton" , "Mount Airy" ] } , { "Curtis Park" : [ "Darby" , "Sharon Hill" ] } , { "Conshohocken" : [ "Spring Mill" , "Norristown TC" ] } , { "Allen Lane" : [ "Carpenter" , "St Martins" ] } , { "Link Belt" : [ "Colmar" , "Chalfont" ] } , { "North Broad" : [ "Temple University" , "Wayne Junction" , "Allegheny" ] } , { "Churchmans Crossing" : [ "Wilmington" , "Newark" ] } , { "Crestmont" : [ "Roslyn" , "Willow Grove" ] } , { "Trenton Transit Center" : [ "Levittown" ] } , { "Jefferson Station" : [ "Temple University" , "Suburban Station" ] } , { "Tulpehocken" : [ "Chelten Avenue" , "Upsal" ] } , { "Stenton" : [ "Washington Lane" , "Sedgwick" ] } , { "Wister" : [ "Wayne Junction" , "Germantown" ] } , { "Warminster" : [ "Hatboro" ] } ]';
  json = JSON.parse(pJson);
  
  var adjacencyList = [];

  var findAdjacentEdges = function(node, graph){
      for (var item in graph) {
      	var obj = graph[item];
      	var station = Object.keys(obj)[0];
      	if (station == node) {
      		return obj[station];
      	}
      }
  }

  	var path = [];
  	var visited = [];
   function BFSstep(n, g, end) {
  	console.log(n);
  		var adjacentNodes = findAdjacentEdges(n, g);
  		visited.push(n);
  		if (n !== undefined) {
  		console.log(adjacentNodes.length);
	  		for (var i = 0; i < adjacentNodes.length; i++) {
	  			if (visited.indexOf(adjacentNodes[i]) == -1) { // if not visited
		  			if (adjacentNodes[i] == end) {
		  				path.push(adjacentNodes[i]);
		  				return true;
		  			} else {
		  				var something = BFSstep(adjacentNodes[i], g, end);
		  				if (something) {
		  					path.push(adjacentNodes[i]);
		  					return true;
		  				}
		  			}
		  		}
	  		}
	  		return false;
	  	} else {
	  		return false;
	  	}
  }
  
  function runBFS(graph, start, end) {
    	var q = [start];
    	console.log("START: "+start+"   ::  END: "+end);
    	path = [];
    	console.log(BFSstep(q, graph, end));
    	path.push(start);
    	console.log(path.reverse());
    	
  }
    
  
  $('#plan_fewest_stops').click(function(){
  	  var startSelect = document.getElementById("start");
  	  var destSelect = document.getElementById("dest");
      var start = startSelect.options[startSelect.selectedIndex].value;
      var dest = destSelect.options[destSelect.selectedIndex].value;
      if (start == "Current Location") {
      	start = closest_station;
      }

      var queue = [];
      runBFS(json, start, dest, queue);
      var pathWords = "";
      for (var i = 0; i < path.length; i++) {
      	pathWords = pathWords + ", " + path[i];
      }
      pathWords = pathWords.substr(2);
      $("#path_label").html("The path you should take is:");
	  $("#stuff").html(pathWords);
	  

  });
})

.controller('NextTrainController', function($scope, $ionicLoading) {
	var showNumberOfOptions = 3;

	
	
	getYourRailStation();
	function getYourRailStation() {
			$("#next_train_header span").html(closest_station);
			var url = "http://www3.septa.org/hackathon/Arrivals/"+ closest_station +"/5/";
      
      
			$.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent(url) + '&callback=?', function(data){
		        var resp = JSON.parse(data.contents);
		        $.each(resp, function(i, item) {
		          //item is an array of two, N & S
		          if (item[0] instanceof Array) {
		          	
		          	//SEPTA's API just outputs an empty array instead of an Object if it has no trains going in that direction, therefore we check for an instance of an array
		            document.getElementById("northbound0").innerHTML = "No trains going Northbound";
		            
		          } else {
					  var firstTrainNorthbound = item[0].Northbound[0];	
					  document.getElementById("northbound0").innerHTML = "<span class='train_id'>to "+firstTrainNorthbound.destination+"</span><span class='path'> departing at "+cleanUpDepartTime(firstTrainNorthbound.depart_time);
		            
		            
					  //Add a number of optional trains after the next train, the number of which is defined by showNumberOfOptions, keep track of how many are shown with numberOfOptionsShown
					  var numberOfOptionsShown = 1;
					  for (var i = 1; i < showNumberOfOptions; i++) {
		            	
						  if (item[0].Northbound[i] !== undefined) {
		            		
							  var trainObj = item[0].Northbound[i];
		            		
							  var elementID = "northbound" + i;
		            		
							  var newTrainDiv = document.createElement('div');
							
							  newTrainDiv.setAttribute('id', elementID);
							  newTrainDiv.setAttribute('class', "northbound");
							
							  newTrainDiv.innerHTML = "<span class='train_id'>to "+trainObj.destination+"</span><span class='path'> departing at "+cleanUpDepartTime(trainObj.depart_time);
							
							  document.getElementById("northbound_list").appendChild(newTrainDiv);
							
							  numberOfOptionsShown++;
						  }
					  }
					  document.getElementById("northbound_label").innerHTML = "The next "+numberOfOptionsShown+" trains going <b>Northbound</b>"; 
		          
		          }
		          if (item[1] instanceof Array) {
		          
					  document.getElementById("southbound0").innerHTML = "No trains going Southbound";
		            
		          } else {
		          
					  var firstTrainSouthbound = item[1].Southbound[0];
					  document.getElementById("southbound0").innerHTML = "<span class='train_id'>to "+firstTrainSouthbound.destination+"</span><span class='path'> departing at "+cleanUpDepartTime(firstTrainSouthbound.depart_time);          
		          
					  var numberOfOptionsShown = 1;
					  for (var i = 1; i < showNumberOfOptions; i++) {
		            	
						  if (item[1].Southbound[i] !== undefined) {
		            		
							  var trainObj = item[1].Southbound[i];
		            		
							  var elementID = "southbound" + i;
		            		
							  var newTrainDiv = document.createElement('div');
							
							  newTrainDiv.setAttribute('id', elementID);
							  newTrainDiv.setAttribute('class', "southbound");
							
							  newTrainDiv.innerHTML = "<span class='train_id'>to "+trainObj.destination+"</span><span class='path'> departing at "+cleanUpDepartTime(trainObj.depart_time);
							
							  document.getElementById("southbound_list").appendChild(newTrainDiv);
							
							  numberOfOptionsShown++;
						  }
					  }
					  document.getElementById("southbound_label").innerHTML = "The next "+numberOfOptionsShown+" trains going <b>Southbound</b>"; 
		          }
		       });
    	});
	};

  
	function cleanUpDepartTime(time) {
  		time = time.substr(time.length - 14);
  		var PMAM = time.substr(time.length - 2);
  		var hour = time.substr(0, 2);
  		if (hour.substr(0, 1) == "0") {
  			hour = hour.substr(1);
  		}
  		var minute = time.substr(3, 2);
  		return hour+":"+minute+" "+PMAM;
  		
	}
  
	$("#nextTrainRefresh").click(function() {
	  	var northbound_list = document.getElementById("northbound_list");
	  	var southbound_list = document.getElementById("southbound_list");
	  	while (northbound_list.childNodes.length > 2) {
	  		northbound_list.removeChild(northbound_list.lastChild);
	  	}
	  	while (southbound_list.childNodes.length > 2) {
	  		southbound_list.removeChild(southbound_list.lastChild);
	  	}
	    getYourRailStation();
	});
  
});
