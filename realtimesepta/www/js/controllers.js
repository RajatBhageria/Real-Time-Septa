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


  var pJson = '[ { "Oreland" : [ "Fort Washington" ] } , { "Ryers" : [ "Fox Chase" ] } , { "Fernwood-Yeadon" : [ "Lansdowne" ] } , { "Airport Terminal C & D" : [ "Airport Terminal E & F" ] } , { "Neshaminy Falls" : [ "Langhorne" ] } , { "Levittown" : [ "Trenton Transit Center" ] } , { "Crum Lynne" : [ "Eddystone" ] } , { "Queen Lane" : [ "Chelten Avenue" ] } , { "Suburban Station" : [ "30th Street Station" , "Jefferson Station" ] } , { "Glenolden" : [ "Norwood" ] } , { "Fortuna" : [ "Colmar" ] } , { "Devon" : [ "Berwyn" ] } , { "Langhorne" : [ "Woodbourne" ] } , { "Noble" : [ "Rydal" ] } , { "Airport Terminal A" : [ "Airport Terminal B" ] } , { "Airport Terminal B" : [ "Airport Terminal C & D" ] } , { "Darby" : [ "Curtis Park" ] } , { "Wynnewood" : [ "Ardmore" ] } , { "North Hills" : [ "Oreland" ] } , { "Holmesburg" : [ "Torresdale" ] } , { "Overbrook" : [ "Merion" ] } , { "Glenside" : [ "North Hills" , "Ardsley" ] } , { "Highland" : [ "Chestnut Hill West" ] } , { "Elwyn" : [  ] } , { "Daylesford" : [ "Paoli" ] } , { "Roslyn" : [ "Crestmont" ] } , { "Norristown TC" : [ "Main Street" ] } , { "Malvern" : [ "Exton" ] } , { "Chester" : [ "Highland Avenue" ] } , { "Doylestown" : [  ] } , { "Ardmore" : [ "Haverford" ] } , { "University City" : [ "Eastwick" , "49th Street" , "Darby" , "30th Street Station" ] } , { "Wayne Junction" : [ "Wister" , "Olney" , "Fern Rock TC" ] } , { "New Britain" : [ "Del Val College" ] } , { "Rosemont" : [ "Villanova" ] } , { "Claymont" : [ "Wilmington" ] } , { "Somerton" : [ "Trevose" ] } , { "Croydon" : [ "Bristol" ] } , { "Gwynedd Valley" : [ "North Wales" ] } , { "Penllyn" : [ "Gwynedd Valley" ] } , { "Olney" : [ "Lawndale" ] } , { "Prospect Park" : [ "Ridley Park" ] } , { "Carpenter" : [ "Allen Lane" ] } , { "Cynwyd" : [  ] } , { "Narberth" : [ "Wynnewood" ] } , { "Radnor" : [ "St Davids" ] } , { "Yardley" : [ "West Trenton" ] } , { "Secane" : [ "Morton" ] } , { "Gladstone" : [ "Clifton-Aldan" ] } , { "Moylan-Rose Valley" : [ "Media" ] } , { "Angora" : [ "Fernwood-Yeadon" ] } , { "Wilmington" : [ "Churchmans Crossing" ] } , { "Lawndale" : [ "Cheltenham" ] } , { "Chelten Avenue" : [ "Tulpehocken" ] } , { "Pennbrook" : [ "Lansdale" ] } , { "Swarthmore" : [ "Wallingford" ] } , { "Sharon Hill" : [ "Folcroft" ] } , { "Highland Avenue" : [ "Marcus Hook" ] } , { "Washington Lane" : [ "Stenton" ] } , { "Elm Street" : [  ] } , { "Colmar" : [ "Link Belt" ] } , { "Norwood" : [ "Prospect Park" ] } , { "North Wales" : [ "Pennbrook" ] } , { "Bethayres" : [ "Philmont" ] } , { "Exton" : [ "Whitford" ] } , { "Wissahickon TC" : [ "Manayunk" ] } , { "Ardsley" : [ "Roslyn" ] } , { "Wyndmoor" : [ "Gravers" ] } , { "Bristol" : [ "Levittown" ] } , { "Primos" : [ "Secane" ] } , { "Newark" : [  ] } , { "Eddington" : [ "Croydon" ] } , { "Hatboro" : [ "Warminster" ] } , { "Spring Mill" : [ "Conshohocken" ] } , { "Allegheny" : [ "East Falls" ] } , { "Mount Airy" : [ "Wyndmoor" ] } , { "East Falls" : [ "Wissahickon TC" ] } , { "Cornwells Heights" : [ "Eddington" ] } , { "Clifton-Aldan" : [ "Primos" ] } , { "Gravers" : [ "Chestnut Hill East" ] } , { "Lansdowne" : [ "Gladstone" ] } , { "Fern Rock TC" : [ "Melrose Park" ] } , { "Upsal" : [ "Carpenter" ] } , { "Marcus Hook" : [ "Claymont" ] } , { "49th Street" : [ "Angora" ] } , { "Elkins Park" : [ "Jenkintown" ] } , { "Cheltenham" : [ "Ryers" ] } , { "Melrose Park" : [ "Elkins Park" ] } , { "St Davids" : [ "Wayne" ] } , { "Eastwick" : [ "Airport Terminal A" ] } , { "Germantown" : [ "Washington Lane" ] } , { "Morton" : [ "Swarthmore" ] } , { "Philmont" : [ "Forest Hills" ] } , { "Berwyn" : [ "Daylesford" ] } , { "Whitford" : [ "Downingtown" ] } , { "Ivy Ridge" : [ "Miquon" ] } , { "Airport Terminal E & F" : [  ] } , { "30th Street Station" : [ "University City" , "North Philadelphia" , "Wynnefield Avenue" , "Overbrook" , "Suburban Station" ] } , { "Wynnefield Avenue" : [ "Bala" ] } , { "North Philadelphia" : [ "Queen Lane" , "Bridesburg" ] } , { "Temple University" : [ "Jefferson Station" , "Wayne Junction" , "North Broad" ] } , { "Del Val College" : [ "Doylestown" ] } , { "Chalfont" : [ "New Britain" ] } , { "Media" : [ "Elwyn" ] } , { "Merion" : [ "Narberth" ] } , { "Chestnut Hill East" : [  ] } , { "Strafford" : [ "Devon" ] } , { "Fox Chase" : [  ] } , { "Bala" : [ "Cynwyd" ] } , { "Ambler" : [ "Penllyn" ] } , { "Torresdale" : [ "Cornwells Heights" ] } , { "Forest Hills" : [ "Somerton" ] } , { "Wallingford" : [ "Moylan-Rose Valley" ] } , { "Chestnut Hill West" : [  ] } , { "Jenkintown" : [ "Glenside" , "Noble" ] } , { "Villanova" : [ "Radnor" ] } , { "Manayunk" : [ "Ivy Ridge" ] } , { "Paoli" : [ "Malvern" ] } , { "Fort Washington" : [ "Ambler" ] } , { "Bridesburg" : [ "Tacony" ] } , { "Rydal" : [ "Meadowbrook" ] } , { "Wayne" : [ "Strafford" ] } , { "Trevose" : [ "Neshaminy Falls" ] } , { "St Martins" : [ "Highland" ] } , { "Meadowbrook" : [ "Bethayres" ] } , { "Eddystone" : [ "Chester" ] } , { "Thorndale" : [  ] } , { "Bryn Mawr" : [ "Rosemont" ] } , { "Miquon" : [ "Spring Mill" ] } , { "Lansdale" : [ "Fortuna" ] } , { "Downingtown" : [ "Thorndale" ] } , { "Woodbourne" : [ "Yardley" ] } , { "Main Street" : [ "Elm Street" ] } , { "Tacony" : [ "Holmesburg" ] } , { "Ridley Park" : [ "Crum Lynne" ] } , { "Folcroft" : [ "Glenolden" ] } , { "Willow Grove" : [ "Hatboro" ] } , { "Haverford" : [ "Bryn Mawr" ] } , { "Sedgwick" : [ "Mount Airy" ] } , { "Curtis Park" : [ "Sharon Hill" ] } , { "Conshohocken" : [ "Norristown TC" ] } , { "Allen Lane" : [ "St Martins" ] } , { "Link Belt" : [ "Chalfont" ] } , { "North Broad" : [ "Wayne Junction" , "Allegheny" ] } , { "Churchmans Crossing" : [ "Newark" ] } , { "Crestmont" : [ "Willow Grove" ] } , { "Trenton Transit Center" : [  ] } , { "Jefferson Station" : [ "Suburban Station" , "Temple University" ] } , { "Tulpehocken" : [ "Upsal" ] } , { "Stenton" : [ "Sedgwick" ] } , { "Wister" : [ "Germantown" ] } , { "Warminster" : [  ] } ]';
  json = JSON.parse(pJson);
  
  var adjacencyList = [];

/*
  $.each(json, function(i, item) {
    console.log(item);
    var tmp_array = [];
    for (var prop in object) {
      tmp_array = [prop, object[prop]];
        break;
    }
  
      //adjacencyList.push(tmp_array);
  })

*/
  
  //console.log(adjacencyList);

  var findAdjacentEdges = function(node, graph){
      for (var item in graph) {
      	var obj = graph[item];
      	var station = Object.keys(obj)[0];
      	if (station == node) {
      		return obj[station];
      	}
      }
  }

  var v;
  var runBFS = function(graph, pStart, pDest, q){
    q.push(pStart);
    path.push(pStart);
    while (q.length > 0){
      v = q.pop();
      var adjacentEdges = findAdjacentEdges(v, graph);
      if (adjacentEdges.length > 0){
        for (var i = 0; i < adjacentEdges.length; i++){
        	var w = adjacentEdges[i];
          if (w === pDest){
            console.log(w);
            break;
          }
          else{            
            runBFS(graph, w, pDest,q);
            console.log(w);
          }

		    }
      }
      return path;
    }
  } 
    
  
  $('#plan_fewest_stops').click(function(){
  	  var startSelect = document.getElementById("start");
  	  var destSelect = document.getElementById("dest");
      var start = startSelect.options[startSelect.selectedIndex].value;
      var dest = destSelect.options[destSelect.selectedIndex].value;
      if (start == "Current Location") {
      	start = closest_station;
      }
      //console.log(json);
      //console.log("Start: " + start);
      //console.log("Destination: " + dest);
      var queue = [];
      console.log("Path: "+runBFS(json, start, dest, queue));
      //console.log("Adjacent Edges: " + findAdjacentEdges(start, json));

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
