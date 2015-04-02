var app = angular.module('enrollApp');

app.controller('buttonsController', function($scope, $http) {

	$scope.closeModal = function (modalName) {
		$(modalName).foundation('reveal', 'close');
	};
	
});