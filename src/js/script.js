processController = function($scope, $http) {

    var success = function(response) {
    	console.log(response.data);
    	jsonObject = angular.fromJson(response.data);
    	console.log('json=' + response.data);
    	$scope.message = jsonObject.msg;
    	$scope.notes = jsonObject.notes;
    }

    var error = function(reason) {
    	console.log(reason);
    	$scope.message = 'fel';
    }

	$http.get(ENDPOINT_URL + 'list')
		 .then(success, error);

	var notes = [
		'Brännbara CD nästan slut',
		'Blogga om bla bla bla',
		'Glöm inte betala danskursen faktura i mail',
	];

	var removeTop = function() {
		console.log('removeTop');
		$scope.notes = $scope.notes.slice(1);
	};

	$scope.removeTop = removeTop;
	$scope.notes = notes;
}

var app = angular.module("remindApp", []);
app.controller("processController", processController);
