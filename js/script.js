
// localStorage

LS = window.localStorage;


// Backend API helpers

var addAPI = function($http, note, email) {
	console.log('addAPI');
	return $http({
			method: "POST",
			url: ENDPOINT_URL + 'add',
			data: JSON.stringify({note: note, email: email}),
			headers: { 'Content-Type': 'application/json' }
	});
}

var listAPI = function($http, email) {
	console.log('listAPI');
	return $http.get(ENDPOINT_URL + 'list/' + email);
};

var removeTopAPI = function($http, email) {
	console.log('removeTopAPI');
	return $http.get(ENDPOINT_URL + 'remove_top/' + email);
};


// Window object helpers

var emailFromWindow = function(window) {
	return LS.email;
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
	            $scope.saved = true;
	            console.log('Trying to hide the lot.');
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

	var onError = function(response) {
		console.log('onError');
		console.log(response);
		$scope.message = "Error: " + response.statusText;
	};

	var onSuccessfullRemoveTop = function(response) {
		console.log('tickle/remove_top OK');
		console.log(response);
		$scope.backendAwake = true;
	};

	var onSuccessfullAdd = function(response) {
		console.log('tickle/add OK');
		console.log(response);
		removeTopAPI($http, email).then(onSuccessfullRemoveTop, onError);
	};

	$scope.message = 'Kontaktar back-end...';
	addAPI($http, '', email).then(onSuccessfullAdd, onError);

	$scope.collect = collect;
	$scope.note = '';
	$scope.isSaving = false;
	$scope.message= '';
	$scope.email = email;
	$scope.backendAwake = false;
	$scope.saved = false;
};

var indexController = function($scope, $window) {

	var email = emailFromWindow($window);

    var goCollect = function() {
    	console.log('goCollect');
    	LS.email = $scope.email;
    	surfTo($window, "collect.html");
    };

    var goProcess = function() {
    	console.log('goProcess');
    	LS.email = $scope.email;
    	surfTo($window, "process.html");
    };

	$scope.goCollect = goCollect;
	$scope.goProcess = goProcess;

	if ( email )
		$scope.email = email;
};


var signupController = function($scope, $window) {

    var createAccount = function(email, password) {
    	console.log('createAccount');
    	$scope.message = "Konto skapat";
    	surfTo($window, '/');
    };

	$scope.createAccount = createAccount;
	$scope.message = '';
};


// AngularJS app

var app = angular.module("remindApp", []);
app.controller("processController", processController);
app.controller("collectController", collectController);
app.controller("indexController", indexController);
app.controller("signupController", signupController);

