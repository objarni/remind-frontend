processController = function($scope, $http) {

    var success = function(response) {
    	console.log(response.data);
    	jsonObject = angular.fromJson(response.data);
    	console.log('json=' + response.data);
    	$scope.notes = jsonObject.notes;
    }

    var error = function(reason) {
    	console.log(reason);
    	$scope.message = 'fel';
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
}

var app = angular.module("remindApp", []);
app.controller("processController", processController);
