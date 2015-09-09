console.log('hej2');

processController = function($scope, $http) {

    var success = function(jsonObject) {
    	console.log('success');
    	console.log(jsonObject);
    	$scope.message = jsonObject['msg'];
    }

    var error = function(reason) {
    	console.log(reason);
    	$scope.message = 'fel';
    }

	$http.jsonp("https://remind-gtd-micro-app.herokuapp.com?callback=JSON_CALLBACK")
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
