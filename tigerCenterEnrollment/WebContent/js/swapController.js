/**
 * 
 */

var app = angular.module('enrollApp');

app.controller('swapController', function($scope, $http, $window, $q, $routeParams, $location, $interval, enrollmentService){
	
	/* Variables */
	$scope.schedule = [];
	$scope.cart = [];
	$scope.oldSelection = null;
	$scope.newSelection = null;
	$scope.loaded = {}
	$scope.loaded.cart = false;
	$scope.loaded.schedule = false;
	$scope.term = $routeParams.term;
	$scope.query = "";
	$scope.errors = [];
	$scope.successMessages = [];
	$scope.warningMessages = [];
	$scope.errorMessages = [];
	$scope.swapPending = false;
	$scope.swapSuccess = false;
	$scope.progressschedule = 0;
    $scope.progressbarschedule = "";
	$scope.progresscart = 0;
    $scope.progressbarcart = "";
	$scope.selectedCareer = "UGRD";
	$scope.firstLoadDone = false;
	
	/* Functions */
	$scope.init = function(){
		console.log("initializing swap controller");
		
    	var timerSchedule = $interval(function() {
    		$scope.progressschedule = $scope.progressschedule + ((1000 - $scope.progressschedule) / 1.5) / 75;
    	}, 15, 0, true);
    	
    	var timerCart = $interval(function() {
    		$scope.progresscart = $scope.progresscart + ((1000 - $scope.progresscart) / 1.5) / 75;
    	}, 15, 0, true);
		
    	$scope.resultPromise = enrollmentService.basic('get-schedule', {term: $scope.term,
			career: $scope.selectedCareer});
		
		$scope.resultPromise.then(function(data){
			console.log(data);
			$scope.schedule = data.classes;
			$scope.enrolledMessages = data.EMessages;
			$scope.enrolledSuccess = data.success;
			if($routeParams.oldppId){
				console.log("PPID passed in")
				for(i=0; i < $scope.schedule.length; i++){
					if( $scope.schedule[i].ppSearchIdSisGw == $routeParams.oldppId){
						$scope.oldSelection = $scope.schedule[i];
					}
				}
			}
			$scope.loaded.schedule = true;
			$scope.schedule = $scope.loadRealTime($scope.schedule);
			$scope.killProgressSchedule(timerSchedule);
		}, function(data) {
			$scope.errors.push({"description":"An unexpected error has occurred.  Please try again."});
			$scope.majorActionPending = "no";
			$scope.killProgressSchedule(timerSchedule);
		});
		
		$scope.killProgressSchedule = function(timerSchedule) {
			$scope.progressschedule = 1000;
            if (angular.isDefined(timerSchedule)) {
            	$interval.cancel(timerSchedule);
          	}
            $interval(function() {$scope.progressbarschedule = "progressdone";$scope.progressschedule = 0;}, 1000, 1, true);
		}
		
		if($scope.schedule == []){
			$scope.message = "You are not enrolled in any classes";
		}else{
			console.log("Your classes:");
			for (course in $scope.schedule){
				console.log(course.id + " ");
			}	
		}
		
		//Get Cart
		console.log("Getting Cart");
		$scope.resultPromise = enrollmentService.basic('get-cart', {term : $scope.term});
		
		$scope.resultPromise.then(function(data){
			console.log(data);
			$scope.cart = data.classes;
			$scope.cartMessages = data.EMessages;
			$scope.cartSuccess = data.success;
			if($routeParams.newppId){
				console.log("PPID passed in")
				for(i=0; i < $scope.cart.length; i++){
					if( $scope.cart[i].ppSearchIdSisGw == $routeParams.newppId){
						$scope.newSelection = $scope.cart[i];
					}
				}
			}
			$scope.loaded.cart = true;
			$scope.cart = $scope.loadRealTime($scope.cart);
			console.log("Cart: " + $scope.cart.length + " Schedule: " + $scope.schedule.length );
			$scope.killProgressCart(timerCart);
		}, function(data) {
			$scope.errors.push({"description":"An unexpected error has occurred.  Please try again."});
			$scope.majorActionPending = "no";
			$scope.killProgressCart(timerCart);
		});
		
		$scope.killProgressCart = function(timerCart) {
			$scope.progresscart = 1000;
            if (angular.isDefined(timerCart)) {
            	$interval.cancel(timerCart);
          	}
            $interval(function() {$scope.progressbarcart = "progressdone";$scope.progresscart = 0;}, 1000, 1, true);
		}
		
		//Get PendingSwaps
		console.log("Getting Pending Swaps");
		$scope.resultPromise = enrollmentService.basic('pending-swap', {term : $scope.term});
		
		$scope.resultPromise.then(function(data){
			console.log(data);
			$scope.pendingSwaps = data.pendingSwaps;
			$scope.pendingSwaps = $scope.loadRealTimePendingSwap($scope.pendingSwaps);
			
		}, function(data) {
			$scope.errors.push({"description":"An unexpected error has occurred.  Please try again."});
			$scope.majorActionPending = "no";
		});
	};
	
	$scope.swapClasses = function(){
		$scope.errors = [];
		$scope.successMessages = [];
		$scope.warningMessages = [];
		$scope.errorMessages = [];
		$scope.swapPending = true;
		
		if($scope.oldSelection != null & $scope.newSelection != null){
			$scope.resultPromise = enrollmentService.basic('swap-class', {
				oldtermid: $scope.oldSelection.termId, newtermid: $scope.newSelection.termId,
				ppidnew: $scope.newSelection.ppSearchIdSisGw, ppidold: $scope.oldSelection.ppSearchIdSisGw,
				grading: $scope.newSelection.gradingBasisCode, related1 : $scope.newSelection.relatedClassNums[0],
				related2 : $scope.newSelection.relatedClassNums[1], waitlist : $scope.newSelection.waitListAllowed,
				career: $scope.selectedCareer, term: $scope.term});
			
			$scope.resultPromise.then(function(data){
				console.log(data);
				$scope.swapResults = data.results;
				$scope.errors = data.eMessages;
				for (var i = 0; i < data.status.length; i++) {
					if (data.status[i].messageSeverity == "S" || data.status[i].messageSeverity == "I") {
						$scope.successMessages.push(data.status[i]);
						$scope.swapSuccess = true;
					} else if (data.status[i].messageSeverity == "E") {
						$scope.errorMessages.push(data.status[i]);
					} else {
						$scope.warningMessages.push(data.status[i]);
					}
				}
				$scope.swapPending = false;
			}, function(data) {
				$scope.errors.push({"description":"An unexpected error has occurred.  Please try again."});
				$scope.majorActionPending = "no";
			});
		} else {
			$scope.errors.push({"description":"You must select both a current class and a new class in order to perform a swap."})
			$scope.swapPending = false;
		}
	}
	
    $scope.loadRealTime = function(classList){
    	var updatedList = loadRealTime(classList, $q, $http);
    	return updatedList;
    }
    
    $scope.loadRealTimePendingSwap = function(pendingSwaps){
    	
    	var classList = [];
    	for(var i = 0; i < pendingSwaps.length; i++){
    		classList.push(pendingSwaps[i].currentClass);
    		classList.push(pendingSwaps[i].swappingClass);
    	}
    	
    	var updatedList = loadRealTime(classList, $q, $http);
    	
    	for(var i = 0; i < pendingSwaps.length; i++){
	    	for(var j = 0; j < updatedList.length; j++){
	    		if (pendingSwaps[i].currentClass.ppSearchIdSisGW == updatedList[j].ppSearchIdSisGW){
	    			pendingSwaps[i].currentClass = updatedList[j];
	    			break;
	    		}else if( pendingSwaps[i].swappingClass.ppSearchIdSisGW == updatedList[j].ppSearchIdSisGW ){
	    			pendingSwaps[i].swappingClass = updatedList[j];
	    			break;
	    		}
	    	}
    	}
    	return pendingSwaps;
    }
    
	$scope.searchClasses = function(){
		
		if($scope.oldSelection){
			console.log($scope.searchUrl + "home#/results?query=" + $scope.query + "&campus=" + $scope.user.campus + "&term=" + $scope.term + "&oldppId=" + $scope.oldSelection.ppSearchIdSisGw + "&mode=swap");
			$window.location.href = $scope.searchUrl + "home#/results?query=" + $scope.query + "&campus=" + $scope.user.campus + "&term=" + $scope.term + "&oldppId=" + $scope.oldSelection.ppSearchIdSisGw + "&mode=swap";
		}else{
			console.log($scope.searchUrl + "home#/results?query=" + $scope.query + "&campus=" + $scope.user.campus + "&term=" + $scope.term + "&mode=swap");
			$window.location.href = $scope.searchUrl + "home#/results?query=" + $scope.query + "&campus=" + $scope.user.campus + "&term=" + $scope.term + "&mode=swap";
		}
	}
	
	$scope.initialize = function() {
		if ($scope.user.termsActivated != null && !$scope.firstLoadDone) {
			$scope.init();
			$scope.firstLoadDone = true;
		}
	}
	
	$scope.setupForAnotherSwap = function() {
		$scope.schedule = [];
		$scope.cart = [];
		$scope.oldSelection = null;
		$scope.newSelection = null;
		$scope.loaded = {}
		$scope.loaded.cart = false;
		$scope.loaded.schedule = false;
		$scope.term = $routeParams.term;
		$scope.query = "";
		$scope.errors = [];
		$scope.successMessages = [];
		$scope.warningMessages = [];
		$scope.errorMessages = [];
		$scope.swapPending = false;
		$scope.swapSuccess = false;
		$scope.progressschedule = 0;
	    $scope.progressbarschedule = "";
		$scope.progresscart = 0;
	    $scope.progressbarcart = "";
		
	    $scope.init();
	}
	
	$scope.resolveCareer = function() {
    	if ($scope.user.termsActivated == null) {
    		return "Loading";
    	} else {
    		if ($scope.user.termsActivated[$scope.term] == null) {
    			return "Not Term Active";
    		} else {
    			if ($scope.user.termsActivated[$scope.term].length > 1) {
    			} else if ($scope.user.termsActivated[$scope.term].length == 1) {
    				$scope.selectedCareer = $scope.user.termsActivated[$scope.term][0];
    			} else {
    				$scope.selectedCareer = "UGRD";
    			}
    			return "Loaded";
    		}
    	}
    };
});