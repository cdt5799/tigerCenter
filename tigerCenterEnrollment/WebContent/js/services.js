/**
 * 
 */

var app = angular.module('enrollApp');

app.service('enrollmentService', ['$http', '$q', function($http, $q){
	
	function basic(url, params){
		var deferredAbort = $q.defer();
		
		var request = $http({
			method: 'GET', 
			url: url,
			params: params,
			timeout: deferredAbort.promise
		});
	
		var promise = request.then(
				function(response){
					return( response.data );
				},
				function( response ){
					return($q.reject());
				});
		
		promise.abort = function(){
			deferredAbort.resolve();
		}
		
		promise['finally'](
				function(){
					console.info("Cleaning up all references");
					
					//Set the abort function to a none functional function
					promise.abort = angular.noop;
					
					deferredAbort = request = promise = null; 
				});
			
		return(promise);
	}
	
	return({
		basic: basic
	});
}]);