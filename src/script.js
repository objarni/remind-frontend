console.log('hej2');

processController = function($scope, $http) {

    var success = function(response) {
    	console.log('success');
    	console.log(response.data);
    	jsonObject = angular.fromJson(response.data);
    	$scope.message = jsonObject['msg'];
    }

    var error = function(reason) {
    	console.log(reason);
    	$scope.message = 'fel';
    }

	$http.get("http://localhost:5000")
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
