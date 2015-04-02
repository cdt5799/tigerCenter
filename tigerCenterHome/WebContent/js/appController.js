//make sure console.log exists in ie.
window.console = window.console || {};
window.console.log = window.console.log || function(){};

var app = angular.module('tigerHome', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap','scrollable-table','siyfion.sfTypeahead', 'duScroll', 'ui.calendar']).value('duScrollGreedy', true);

/*GLOBAL CONTROLLER*/
app.controller('AppController', function($scope, $http, $filter, $window, $location, homeService) {	
	$(document).foundation();

	//Google Analytics for Angular Partials
	$scope.$on('$viewContentLoaded', function(event) {
		console.log(event);
		$window.ga('send', 'pageview', { page: "/tigerCenterHome" + $location.path() });
	    }
	);
	
	$scope.locale = locale;
	$scope.defaults = {};
	$scope.user = {};
	$scope.fields = {};
	$scope.fields.shoppingDates = [];
	$scope.fields.filterTerms = [];
	$scope.dates = [];
	
	this.init = function() {
		homeService.basic('header', {}).then(function(data){
	    	console.log("Got the Header");
	    	console.log(data);
	    	if (data.currUser != null) {
		    	$scope.user = data.currUser;
		    	
		    	homeService.basic('important-dates', {}).then(function(data){
		    		console.log("Got the Important Dates");
		    		console.log(data);
		    		
			    	if (data.dates != null && data.defaultTerm != null && data.termStarts != null) {
			    		data.dates = $filter('orderBy')(data.dates, "start");
			        	$scope.defaults.term = data.defaultTerm;
			    		var j = 0;
			    		for (var i = 0; j < 5 && i < data.dates.length; i++) {
			    			if (data.dates[i].start != null && 
			    					(new Date(data.dates[i].start)).getTime() >= (new Date()).getTime()) {
			    				$scope.dates.push(data.dates[i]);
			    				j += 1;
			    			}
			    		}
			    		
			    		$scope.termStarts = data.termStarts;
			    		
			    		homeService.basic('field', {}).then(function(data){
				    		console.log("Got the Fields");
				    		console.log(data);

					    	if (data.error != null && data.termField != null && data.shoppingCartField != null
					    			&& data.componentField != null && data.defaultTerm != null ) {
					    		if(data.error == true){
					            	console.log("ERROR webservice is down");
					            	$scope.fields.webserviceDown = true;
					            	return;
					        	}
			
					            var terms = data.termField;
					            var shoppingDates = data.shoppingCartField;
					            var component = data.componentField;
					            var defaultTerm = data.defaultTerm;
			
					            // set fields
					            $scope.fields.termField = terms;
					        	$scope.fields.shoppingDates = shoppingDates;
					        	$scope.fields.componentField = component;
					        	
				    			$scope.fields.loaded = true;
					    	} else {
								$scope.error = {id:"FDBAD", description:"Sorry, but I couldn't process your request at this time. If the problem persists please check the support page and provide this code.", severity:1};
					    	}
				    	}, function(data){
				    		console.log(data);
							$scope.error = {id:"FDFAIL", description:"Sorry, but I couldn't process your request at this time. If the problem persists please check the support page and provide this code.", severity:1};
				    	});
			    	} else {
						$scope.error = {id:"IDBAD", description:"Sorry, but I couldn't process your request at this time. If the problem persists please check the support page and provide this code.", severity:1};
			    	}
		    	}, function(data){
		    		console.log(data);
					$scope.error = {id:"IDFAIL", description:"Sorry, but I couldn't process your request at this time. If the problem persists please check the support page and provide this code.", severity:1};
		    	});
	    	} else {
	    		$scope.error = {id:"HDBAD", description:"Sorry, but I couldn't process your request at this time. If the problem persists please check the support page and provide this code.", severity:1};
	    	}
        }, function(data){
    		console.log(data);
			$scope.error = {id:"HDFAIL", description:"Sorry, but I couldn't process your request at this time. If the problem persists please check the support page and provide this code.", severity:1};
    	});
		
		homeService.basic('nav', {}).then(function(data){
    		console.log("Got the Nav Links");
    		console.log(data);
	    	if(data.error == true){
	    		$scope.error = {id:"NVBAD", description:"Sorry, but I couldn't process your request at this time. If the problem persists please check the support page and provide this code.", severity:1};
	    	}
	    	// set fields
	        $scope.navLinks = data.navLinks;
	        $scope.homeUrl = data.homeUrl;
	        $scope.searchUrl = data.searchUrl;
	        $scope.enrollUrl = data.enrollUrl;
	        
	    	}, function(data){
	    		$scope.error = {id:"NVFAIL", description:"Sorry, but I couldn't process your request at this time. If the problem persists please check the support page and provide this code.", severity:1};
	    		console.log(data);
	    	});
	}
	
	$scope.searchTxt = '';
	
	$(window).resize(function(){
		$('.menu').height($(window).height());
	});

	$(window).load(function() {

		 $('.menu').height($(window).height());
		 var menu = "close";
		 					
			 $('.menu').css({'transform':'translate(-100%, 0)',
			'-webkit-transform':'translate(-100%, 0)',
			'-moz-transform':'translate(-100%, 0)',
			'-o-transform':'translate(-100%, 0)',
			'-ms-transform':'translate(-100%, 0)'});
						
			$('.menuBtn').css({'transform':'translate(0, 0)',
			'-webkit-transform':'translate(0, 0)',
			'-moz-transform':'translate(0, 0)',
			'-o-transform':'translate(0, 0)',
			'-ms-transform':'translate(0, 0)'});
						
			$('#wrapper').css({'transform':'translate(0, 0)',
			'-webkit-transform':'translate(0, 0)',
			'-moz-transform':'translate(0, 0)',
			'-o-transform':'translate(0, 0)',
			'-ms-transform':'translate(0, 0)'});

		 $('.toggle').click(function() {
			 if (menu == "close") {
				 $('.menu').css({'transform':'translate(0, 0)',
					 '-webkit-transform':'translate(0, 0)',
					 '-moz-transform':'translate(0,0)',
					 '-o-transform':'translate(0,0)',
					 '-ms-transform':'translate(0,0)'});
				 
				 $('.menuBtn').css({'transform':'translate(250px, 0)',
					 '-webkit-transform':'translate(250px, 0)',
					 '-moz-transform':'translate(250px, 0)',
					 '-o-transform':'translate(250px, 0)',
					 '-ms-transform':'translate(250px, 0)'});
				 
				 $('#wrapper').css({'transform':'translate(250px, 0)',
					 '-webkit-transform':'translate(250px, 0)',
					 '-moz-transform':'translate(250px, 0)',
					 '-o-transform':'translate(250px, 0)',
					 '-ms-transform':'translate(250px, 0)'});
				 menu = "open";
			 } else {
				 $('.menu').css({'transform':'translate(-100%, 0)',
					 '-webkit-transform':'translate(-100%, 0)',
					 '-moz-transform':'translate(-100%, 0)',
					 '-o-transform':'translate(-100%, 0)',
					 '-ms-transform':'translate(-100%, 0)'});
				 
				 $('.menuBtn').css({'transform':'translate(0, 0)',
					 '-webkit-transform':'translate(0, 0)',
					 '-moz-transform':'translate(0, 0)',
					 '-o-transform':'translate(0, 0)',
					 '-ms-transform':'translate(0, 0)'});
				 
				 $('#wrapper').css({'transform':'translate(0, 0)',
					 '-webkit-transform':'translate(0, 0)',
					 '-moz-transform':'translate(0, 0)',
					 '-o-transform':'translate(0, 0)',
					 '-ms-transform':'translate(0, 0)'});
				 menu = "close";
			 }
		 });
	});
	
	this.init();
});
