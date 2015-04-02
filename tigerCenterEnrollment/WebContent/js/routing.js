var app = angular.module('enrollApp');

/*PROVIDES URL ROUTING FOR THE APP*/
app.config(function ($routeProvider) {
	$routeProvider.when('/myClasses', {
		templateUrl: 'partials/myClasses.html',
		controller: 'myClassController'
	}).when('/modal', {
		templateUrl: 'partials/modal.html',
		controller: 'buttonController'
	}).when('/buttons', {
		templateUrl: 'partials/buttons.html',
		controller: 'buttonsController'
	}).when('/swap', {
		templateUrl: 'partials/swap.html',
		controller: 'swapController'
	}).otherwise({ redirectTo: '/myClasses' });
});
