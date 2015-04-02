var app = angular.module('tigerHome');

/*PROVIDES URL ROUTING FOR THE APP*/
app.config(function ($routeProvider) {
	$routeProvider.when('/index', {
		templateUrl: 'partials/index.html',
		controller: 'indexController'
	}).otherwise({ redirectTo: '/index' });
});
