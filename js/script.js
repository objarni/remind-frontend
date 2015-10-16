
// localStorage

LS = window.localStorage;


// Backend API helpers

var addAPI = function($http, token, note) {
	console.log('addAPI');
	return $http({
			method: "POST",
			url: ENDPOINT_URL + 'add',
			data: JSON.stringify({note: note, token: token}),
			headers: { 'Content-Type': 'application/json' }
	});
};

var listAPI = function($http, token) {
	console.log('listAPI');
	return $http({
			method: "POST",
			url: ENDPOINT_URL + 'list',
			data: JSON.stringify({token: token}),
			headers: { 'Content-Type': 'application/json' }
	});
};

var removeTopAPI = function($http, token) {
	console.log('removeTopAPI');
	return $http({
			method: "POST",
			url: ENDPOINT_URL + 'remove_top',
			data: JSON.stringify({token: token}),
			headers: { 'Content-Type': 'application/json' }
	});
};

var getEmailAPI = function($http, token) {
	console.log('getEmailAPI');
	return $http({
			method: "POST",
			url: ENDPOINT_URL + 'get_email',
			data: JSON.stringify({token: token}),
			headers: { 'Content-Type': 'application/json' }
	});
};

var authenticateUserAPI = function($http, email, password) {
	console.log('authenticateUserAPI');
	return $http({
			method: "POST",
			url: ENDPOINT_URL + 'authenticate_user',
			data: JSON.stringify({email: email, password: password}),
			headers: { 'Content-Type': 'application/json' }
	});
};

var addUserAPI = function($http, email, password) {
	console.log('addUserAPI');
	return $http({
			method: "POST",
			url: ENDPOINT_URL + 'add_user',
			data: JSON.stringify({email: email, password: password}),
			headers: { 'Content-Type': 'application/json' }
	});
};


// TODO: the POST-APIs could use a common function

// General http response error handler

var onError = function(response) {
	console.log('Error response:');
	console.log(response);
};


// Browser redirect via javascript

var surfTo = function(window, url) {
    window.location.href = url;
};


// AngularJS controllers

var processController = function($scope, $http, $window) {

	var token = LS['token'];

	Mousetrap.bind('del', function() { $scope.removeTop(); });

	var success = function(response) {
		console.log(response.data);
		jsonObject = angular.fromJson(response.data);
		console.log('json=' + response.data);
		$scope.notes = jsonObject.notes;
		$scope.booting = false;
	}

	var removeTop = function() {
		console.log('removeTop');
		removeTopAPI($http, token);
		$scope.notes = $scope.notes.slice(1);
	};

	listAPI($http, token).then(success, onError);

	$scope.removeTop = removeTop;
	$scope.notes = [];
	$scope.booting = true;
};

var collectController = function($scope, $http, $timeout, $window) {

	var token = LS['token'];

	var collect = function(note) {
		console.log('collect');
		$scope.isSaving = true;
		$scope.message = 'Sparar...';
		console.log($scope.isSaving);
		addAPI($http, token, note)
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


	$scope.collect = collect;
	$scope.note = '';
	$scope.isSaving = false;
	$scope.message= '';
	// TODO: backendAwake is never false. How communicate loggedInController
	// state change to processController?
	// It's really a state 'connecting/checking'
	$scope.backendAwake = true;
	$scope.saved = false;
};

var indexController = function($scope, $window) {
	// TODO: might remove the controller altogether.
	// loggedInController handles the collect/process/LS behaviour.
};


var signupController = function($scope, $http, $window, $timeout) {

	var onSuccess = function(response) {
		console.log('onSuccess');
		var json = response.data;
		console.log(json);
		if (json.account_created) {
			$scope.message = "Konto skapat.";
	    	$timeout(function(){
		    	surfTo($window, 'login.html');
	        }, 1000);
	    }
	    else {
	    	$scope.message = 'Kontot finns redan!';
	    }
	};

    var createAccount = function(email, password) {
    	console.log('createAccount');
    	addUserAPI($http, email, password)
    	.then(onSuccess, onError);
    };

	$scope.createAccount = createAccount;
	$scope.message = '';
};


var loginController = function($scope, $http, $window, $timeout) {

	var onSuccess = function(response) {
		console.log('onSuccess');
		console.log(response);
		var json = response.data;
		var logged_in = json.logged_in;
		if (logged_in) {
			$scope.message = 'Välkommen!';
			LS['token'] = json.token;
	    	$timeout(function(){
		    	surfTo($window, 'collect.html');
	        }, 1000);
	    }
	    else {
	    	$scope.message = 'Fel epost eller lösenord. Försök igen.';
	    	$timeout(function(){
	    		$scope.message = '';
	        }, 2000);
	    }
	};

    var login = function(email, password) {
    	console.log('login');
    	$scope.message = "Loggar in...";
		LS['email'] = email;
    	authenticateUserAPI($http, email, password)
    	.then(onSuccess, onError);
    };

	$scope.login = login;
	$scope.message = '';
};

var loggedInController = function($scope, $window, $http) {

	var token = LS['token'];
	var loggedIn = false;

	var logout = function() {
		LS.removeItem('token');
		surfTo($window, 'index.html');
	}

	// Present email to user. If possible then we regard
	// app as being logged in, otherwise conclude we're
	// not logged in (and don't touch loggedIn model var),
	// and perform 'proper' logout procedure.
	var onSuccess = function(response) {
		json = response.data;
		if ( json.status == 'NOSESSION' ) {
			logout();
		}
		else {
			$scope.email = json.email;
			$scope.loggedIn = true;
		}
	}
	if ( token ) {
		getEmailAPI($http, token)
		.then(onSuccess, onError);
	}

	$scope.logout = logout;
	$scope.loggedIn = loggedIn;
};


// AngularJS app

var app = angular.module("remindApp", []);
app.controller("processController", processController);
app.controller("collectController", collectController);
app.controller("indexController", indexController);
app.controller("signupController", signupController);
app.controller("loginController", loginController);
app.controller("loggedInController", loggedInController);
