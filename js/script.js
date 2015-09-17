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

	$http.get(ENDPOINT_URL + 'list')
	.then(success, error);

	var removeTop = function() {
		console.log('removeTop');
		$http.get(ENDPOINT_URL + 'remove_top');
		$scope.notes = $scope.notes.slice(1);
	};

	$scope.removeTop = removeTop;
	$scope.notes = [];
	$scope.booting = true;
};

var collectController = function($scope, $http, $timeout) {

	var collect = function(note, email) {
		console.log('collect');
		console.log('email ' + email);
		$scope.isSaving = true;
		$scope.message = 'Sparar...';
		console.log($scope.isSaving);
		$http({
			url: ENDPOINT_URL + 'add',
			method: "POST",
			headers: { 'Content-Type': 'application/json' },
			data: JSON.stringify({note: note, email: email})
		}).success(function(data) {
			$scope.isSaving = false;
			$scope.message = 'Sparat. :)';
			$scope.note = '';
	        $timeout(function(){
	            $scope.message = '';
	        }, 2000);
	        console.log(data)
		});
	}

	$scope.collect = collect;
	$scope.note = '';
	$scope.isSaving = false;
	$scope.message= '';
	$scope.email = window.location.search.substring(1);
};

var indexController = function($scope, $window) {

    var goCollect = function() {
    	console.log('goCollect');
        $window.location.href = "collect.html";
    };

    var goProcess = function() {
    	console.log('goProcess');
        $window.location.href = "process.html";
    };


	$scope.goCollect = goCollect;
	$scope.goProcess = goProcess;
};


var app = angular.module("remindApp", []);
app.controller("processController", processController);
app.controller("collectController", collectController);
app.controller("indexController", indexController);
