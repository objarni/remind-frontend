// Backend API helpers

var remoteTop = function($http, email) {
	return $http.get(ENDPOINT_URL + 'remove_top/' + email);
}

var addToBackend = function($http, note, email) {
	return $http({
			url: ENDPOINT_URL + 'add',
			method: "POST",
			headers: { 'Content-Type': 'application/json' },
			data: JSON.stringify({note: note, email: email})
	});
}


var processController = function($scope, $http) {

	var success = function(response) {
		console.log(response.data);
		jsonObject = angular.fromJson(response.data);
		console.log('json=' + response.data);
		$scope.notes = jsonObject.notes;
		$scope.booting = false;
	}

	var error = function(reason) {
		console.log(reason);
		$scope.message = 'fel';
		$scope.booting = false;
	}

	var email = window.location.search.substring(1);


	var listCall = ENDPOINT_URL + 'list/' + email
	console.log(listCall);

	$http.get(listCall).then(success, error);

	var removeTop = function() {
		console.log('removeTop');
		removeTop($http, email);
		$scope.notes = $scope.notes.slice(1);
	};

	$scope.removeTop = removeTop;
	$scope.notes = [];
	$scope.booting = true;
	$scope.email = email;
};

var collectController = function($scope, $http, $timeout) {

	var collect = function(note, email) {
		console.log('collect');
		console.log('email ' + email);
		$scope.isSaving = true;
		$scope.message = 'Sparar...';
		console.log($scope.isSaving);
		addToBackend($http, note, email)
		.success(function(data) {
			$scope.isSaving = false;
			$scope.message = 'Sparat. :)';
			$scope.note = '';
	        $timeout(function(){
	            $scope.message = '';
	        }, 2000);
	        console.log(data)
		});
	};

	var email = window.location.search.substring(1);

	// Tickle backend when page is loaded
	// to prevent slow save operation
	// (Heroku dynos sleep after 30 minutes)
	// Hack: add empty string, then remove it!
	// Will not make any difference for users'
	// real data as order is FIFO (stack).
	addToBackend($http, '', email)
	.success(function(data) {
		remoteTop($http, email)
		.success(function(data) {
			$scope.backendAwake = true;
		});
	});


	$scope.collect = collect;
	$scope.note = '';
	$scope.isSaving = false;
	$scope.message= '';
	$scope.email = email;
	$scope.backendAwake = false;
};


var indexController = function($scope, $window) {

    var goCollect = function() {
    	console.log('goCollect');
        $window.location.href = "collect.html?" + $scope.email;
    };

    var goProcess = function() {
    	console.log('goProcess');
        $window.location.href = "process.html?" + $scope.email;
    };


	$scope.goCollect = goCollect;
	$scope.goProcess = goProcess;
};


var app = angular.module("remindApp", []);
app.controller("processController", processController);
app.controller("collectController", collectController);
app.controller("indexController", indexController);
