//make sure console.log exists in ie.
window.console = window.console || {};
window.console.log = window.console.log || function(){};

var app = angular.module('enrollApp', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap','scrollable-table','siyfion.sfTypeahead', 'duScroll']).value('duScrollGreedy', true);

/*GLOBAL CONTROLLER*/
app.controller('AppController', function($scope, $http, $filter, $window, $location, enrollmentService) {
	$(document).foundation();
	
	//Google Analytics for Angular Partials
	$scope.$on('$viewContentLoaded', function(event) {
		console.log(event);
		$window.ga('send', 'pageview', { page: "/tigerCenterEnrollment" + $location.path() });
	    }
	);
	
	$scope.locale = locale;
	$scope.defaults = {};
	$scope.user = {};
	$scope.fields = {};
	$scope.ieversion = -1;
	
	// returns the version of Internet Explorer or a -1
    // (indicating the use of another browser).
	$scope.getInternetExplorerVersion = function(){
		var rv = -1; // return value assumes failure.
		if (navigator.appName == 'Microsoft Internet Explorer')
		{
			var ua = navigator.userAgent;
			var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) != null)
				rv = parseFloat( RegExp.$1 );
		}
		return rv;
    };
    
    this.init = function(){
    	$scope.ieversion = $scope.getInternetExplorerVersion();
    	
        enrollmentService.basic('header', {}).then(function(data){
	    	console.log("Got the Header");
	    	console.log(data);
	    	
	    	if(data.error){
	    		$scope.error = {id:"HDBAD", description:"Sorry, but I couldn't process your request at this time. If the problem persists please check the support page and provide this code.", severity:1};
	    	}
	    	
	    	$scope.user = data.currUser;
	    	
	    	enrollmentService.basic('field', {}).then(function(data){
	    		console.log("Got the Field");
	    		console.log(data);
    	    	if(data.error == true){
    	    		$scope.error = {id:"FDBAD", description:"Sorry, but I couldn't process your request at this time. If the problem persists please check the support page and provide this code.", severity:1};
    	    	}else{
    	    		// set fields
	    	        $scope.fields.termField = data.termField;
	    	    	$scope.fields.shoppingDates = data.shoppingCartField;
	    	    	$scope.fields.componentField = data.componentField;
	    	    	$scope.fields.gradingField = data.gradingField;
	    	    	$scope.defaults.term = data.defaultTerm;

	    			$scope.fields.loaded = true;	
    	    	}
	    	}, function(data){
	    		$scope.error = {id:"FDFAIL", description:"Sorry, but I couldn't process your request at this time. If the problem persists please check the support page and provide this code.", severity:1};
	    		console.log(data);
	    	});
        }, function(data){
        	$scope.error = {id:"HDFAIL", description:"Sorry, but I couldn't process your request at this time. If the problem persists please check the support page and provide this code.", severity:1}
    		console.log(data);
    	});
        
        enrollmentService.basic('nav', {}).then(function(data){
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
        
        if ($scope.ieversion > 0 && $scope.ieversion < 9) {
        	// Do Something
        } else {
        	//Don't Do Anything as far as I know
        }
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









