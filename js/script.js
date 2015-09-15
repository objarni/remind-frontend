processController = function($scope, $http) {

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

collectController = function($scope, $http) {

	var collect = function($note) {
		console.log('collect');
		$http.post(ENDPOINT_URL + 'add',
		           { note: $note} );
	}

	$scope.collect = collect;
	$scope.note = '';
};

var app = angular.module("remindApp", []);
app.controller("processController", processController);
app.controller("collectController", collectController);
