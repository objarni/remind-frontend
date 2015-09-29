

// Backend API helpers

var addAPI = function($http, note, email) {
	return $http({
			method: "POST",
			url: ENDPOINT_URL + 'add',
			data: JSON.stringify({note: note, email: email}),
			headers: { 'Content-Type': 'application/json' }
	});
}

var listAPI = function($http, email) {
	return $http.get(ENDPOINT_URL + 'list/' + email);
};

var removeTopAPI = function($http, email) {
	return $http.get(ENDPOINT_URL + 'remove_top/' + email);
};


// Window object helpers

var emailFromWindow = function(window) {
	return window.location.search.substring(1);
}

var surfTo = function(window, url) {
    window.location.href = url;
}


// AngularJS controllers

var processController = function($scope, $http, $window) {

	Mousetrap.bind('del', function() { $scope.removeTop(); });

	var email = emailFromWindow($window);

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

	var removeTop = function() {
		console.log('removeTop');
		removeTopAPI($http, email);
		$scope.notes = $scope.notes.slice(1);
	};

	listAPI($http, email).then(success, error);

	$scope.removeTop = removeTop;
	$scope.notes = [];
	$scope.booting = true;
	$scope.email = email;
};

var collectController = function($scope, $http, $timeout, $window) {

	var email = emailFromWindow($window);

	var collect = function(note, email) {
		console.log('collect');
		console.log('email ' + email);
		$scope.isSaving = true;
		$scope.message = 'Sparar...';
		console.log($scope.isSaving);
		addAPI($http, note, email)
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

	// Tickle backend when page is loaded
	// to prevent slow save operation
	// (Heroku dynos sleep after 30 minutes)
	// Hack: add empty string, then remove it!
	// Will not make any difference for users'
	// real data as order is FIFO (stack).
	addAPI($http, '', email)
	.success(function(data) {
		removeTopAPI($http, email)
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
    	surfTo($window, "collect.html?" + $scope.email);
    };

    var goProcess = function() {
    	console.log('goProcess');
    	surfTo($window, "process.html?" + $scope.email);
    };

	$scope.goCollect = goCollect;
	$scope.goProcess = goProcess;
};


// AngularJS app

var app = angular.module("remindApp", []);
app.controller("processController", processController);
app.controller("collectController", collectController);
app.controller("indexController", indexController);
