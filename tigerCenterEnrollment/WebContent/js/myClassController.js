/**
 * 
 */
var app = angular.module('enrollApp');
app.controller('myClassController', function($scope, $http, $window, $location, $q, $interval, enrollmentService){
	/* Start Foundations*/
	$(document).foundation();

	/* Controller Variables */
	$scope.progressschedule = 0;
    $scope.progressbarschedule = "";
	$scope.progresscart = 0;
    $scope.progressbarcart = "";
	$scope.majorActionPending = "no";
	$scope.minEnrolledCredits = 0;
	$scope.maxEnrolledCredits = 0;
	$scope.selectedCareer = "UGRD";
	$scope.schedule = [];
	$scope.cart = [];
	$scope.form = {};
	$scope.grading = {};
	$scope.grading.option = "S/F";
	$scope.dropCourse = {};
	$scope.loaded = {};
	$scope.loaded.cart = false;
	$scope.loaded.schedule = false;
	$scope.cartErrors = [];
	$scope.scheduleErrors = [];
	$scope.sendForm = true;
	
	$scope.closeModal = function (modalName) {
		$(modalName).foundation('reveal', 'close');
	};
	
	$scope.bookstore = "";
	
	/* Functions Performing an Action on Multiple Courses */
	$scope.checkout = function(){
		console.log("checking out cart");
		$scope.cartErrors = [];
		$scope.majorActionPending = "yes";
		
		var ppids = [];
		var related1s = [];
		var related2s = [];
		var gradingBasis = [];
		var waitListAllowed = [];		
		
		for(i=0; i< $scope.cart.length; i++){
			if ($scope.cart[i].checked) {
				ppids.push($scope.cart[i].ppSearchIdSisGw);
				related1s.push($scope.cart[i].relatedClassNums[0]);
				related2s.push($scope.cart[i].relatedClassNums[1]);
				gradingBasis.push($scope.cart[i].gradingBasisCode);
				waitListAllowed.push($scope.cart[i].waitListAllow);
				
				$scope.cart[i].successMessages = [];
				$scope.cart[i].warningMessages = [];
				$scope.cart[i].errorMessages = [];
				$scope.cart[i].errors = [];
			}
		}
		
		if (ppids.length > 0) {
			$scope.resultPromise = enrollmentService.basic('checkout-cart', {term: $scope.form.termSelect, 
				career: $scope.selectedCareer, ppids: ppids, related1s: related1s, related2s: related2s, 
				grading: gradingBasis, waitList: waitListAllowed});
			
			$scope.resultPromise.then(function(data) {
				console.log(data);
				$scope.cartErrors = data.errorMessages;
				var status = data.status;
				
				console.log("Connecting Checkout Messages to Classes")
				for(i = 0; i < $scope.cart.length; i++){
					for(j = 0; j < status.length; j++){
						if(status[j].validationId == $scope.cart[i].ppSearchIdSisGw){
							console.log("Adding validation message: " + status[j] + " to the class: " + $scope.cart[i].ppSearchIdSisGw);
							if (status[j].messageSeverity == 'S' || status[j].messageSeverity == 'I') {
								console.log("success");
								var success = status[j];
								success.messageDesc =  $scope.cart[i].stuClass.courseTitleLong + " " + $scope.cart[i].stuClass.subject + 
									" " + $scope.cart[i].stuClass.catalogNumber + " " + $scope.cart[i].stuClass.section + " " + 
									$scope.cart[i].stuClass.classNumber + ": " + success.messageDesc;

								
								var copiedCourse = {};
								angular.copy($scope.cart[i], copiedCourse);
								copiedCourse.allowDrop = true;
								copiedCourse.allowSwap = true;
								if (copiedCourse.stuClass.gradingBasis == "SFA") {
									copiedCourse.allowEdit = true;
								}
								
								if (copiedCourse.stuClass.enrollStatus == "W") {
									copiedCourse.enrollStatusCode = "W";
									copiedCourse.enrollStatusDescr = "Wait List";
								} else if (copiedCourse.stuClass.enrollStatus == "O") {
									copiedCourse.enrollStatusCode = "E";
									copiedCourse.enrollStatusDescr = "Enrolled";
									copiedCourse.stuClass.enrollmentTotal += 1;
									
									$scope.minEnrolledCredits += copiedCourse.stuClass.unitsMinimum;
									$scope.maxEnrolledCredits += copiedCourse.stuClass.unitsMaximum;
								} else {
									copiedCourse.enrollStatusCode = "ERR";
									copiedCourse.enrollStatusDescr = "An error occurred. Please refresh the page.";
								}
								
								$scope.cart[i].successMessages.push(success);
								copiedCourse.successMessages.push(status[j]);
								
								$scope.schedule.push(copiedCourse);
								
								$scope.cart[i].hide = true;
							} else if (status[j].messageSeverity == 'E') {
								$scope.cart[i].errorMessages.push(status[j]);
							} else {
								$scope.cart[i].warningMessages.push(status[j]);
							}
							break;
						}
					}
				}
				$interval(function() {
					tempCart = new Array();
					for (k = 0; k < $scope.cart.length; k++) {
						if ($scope.cart[k].hide == undefined || $scope.cart[k].hide == false) {
							tempCart.push($scope.cart[k]);
						}
					}
					
					$scope.cart = tempCart;
				}, 7000, 1, true);
				$scope.majorActionPending = "no";
			}, function(data) {
				$scope.cartErrors.push({"description":"An unexpected error has occurred.  Please try again."});
				$scope.majorActionPending = "no";
			});
		} else {
			$scope.cartErrors.push({'description':'You must select a class to checkout from your cart.'});
			$scope.majorActionPending = "no";
		}
	}
	
	$scope.validateCart = function(){
		console.log("validating the cart");
		$scope.majorActionPending = "yes";
		$scope.cartErrors = [];
		var ppids = [];
		
		for(i=0; i < $scope.cart.length; i++){
			if ($scope.cart[i].checked) {
				ppids.push($scope.cart[i].ppSearchIdSisGw);
				$scope.cart[i].successMessages = [];
				$scope.cart[i].warningMessages = [];
				$scope.cart[i].errorMessages = [];
				$scope.cart[i].errors = [];
			}
		}
		
		if (ppids.length > 0) {
			$scope.resultPromise = enrollmentService.basic('validate', {ppids: ppids,
				term: $scope.form.termSelect, career: $scope.selectedCareer});
			
			$scope.resultPromise.then(function(data) {
				console.log(data);
				$scope.validateSuccess = data.success;
				var status = data.status;
				$scope.cartErrors = data.eMessages;
				
				console.log("Connecting Validation Messages to Classes")
				for(i=0; i < $scope.cart.length; i++){
					for(j=0; j < status.length; j++){
						if(status[j].validationId == $scope.cart[i].ppSearchIdSisGw){
							console.log("Adding validation message: " + status[j] + " to the class: " + $scope.cart[i].ppSearchIdSisGw);
							if (status[j].messageSeverity == 'S' || status[j].messageSeverity == 'I') {
								$scope.cart[i].successMessages.push(status[j]);
							} else if (status[j].messageSeverity == 'E') {
								$scope.cart[i].errorMessages.push(status[j]);
							} else {
								$scope.cart[i].warningMessages.push(status[j]);
							}
							break;
						}
					}
				}
				$scope.majorActionPending = "no";
			}, function(data) {
				$scope.cartErrors.push({"description":"An unexpected error has occurred.  Please try again."});
				$scope.majorActionPending = "no";
			});
		} else {
			$scope.cartErrors.push({'description':'You must select a class to validate from your cart.'});
			$scope.majorActionPending = "no";
		}
	};
	
	/* Functions Performing an Action on a Single Course */
	$scope.clear = function(){
		console.log("clearing all carts");
		$scope.cartErrors = [];
		$scope.majorActionPending = "yes";
		
		$scope.resultPromise = enrollmentService.basic('clear-cart', {});
		
		$scope.resultPromise.then(function(data) {
			console.log(data);
			$scope.cartErrors = data.errorMessages;
			if(data.success){
				$scope.cart =[];
				$scope.cartCleared = true;
				$interval(function() {
					$scope.cartCleared = false;
				}, 7000, 1, true);
			}
			$scope.majorActionPending = "no";
		}, function(data) {
			course.errors.push({"description":"An unexpected error has occurred.  Please try again."});
			course.actionPending = "no";
		});
	}
	
	$scope.removeFromCart = function(course){
		console.log("removing the following from the cart:");
		console.log(course);
		course.successMessages = [];
		course.warningMessages = [];
		course.errorMessages = [];
		course.errors = [];
		course.actionPending = "yes";
		
		$scope.resultPromise = enrollmentService.basic('remove-cart', 
				{'ppid': course.ppSearchIdSisGw, 'term': course.termId, 'career': $scope.selectedCareer});
		
		$scope.resultPromise.then(function(data) {
			console.log(data);
			course.errors = data.eMessages;
			if (data.success){
				course.successMessages.push({"messageDesc":"Successfully removed " + 
					course.stuClass.courseTitleLong + " from your cart."});
				course.hide = true;
				course.checked = false;
				$interval(function() {
					for(i = 0; i < $scope.cart.length; i++){
						if($scope.cart[i].ppSearchIdSisGw == course.ppSearchIdSisGw){
							$scope.cart.splice(i, 1);
							break;
						}
					}
				}, 7000, 1, true);
			} else {
				course.errors = data.status;
			}
			course.actionPending = "no";
		}, function(data) {
			course.errors.push({"description":"An unexpected error has occurred.  Please try again."});
			course.actionPending = "no";
		});
	};
	
	$scope.dropClass = function(course){
		console.log("dropping the following from the schedule:");
		console.log(course);
		
		course.successMessages = [];
		course.warningMessages = [];
		course.errorMessages = [];
		course.errors = [];
		course.actionPending = "yes";
		
		if (course.allowDrop){
			$scope.resultPromise = enrollmentService.basic('drop-class', 
					{'ppid': course.ppSearchIdSisGw, 'term': course.termId, 'career': $scope.selectedCareer});
			
			$scope.resultPromise.then(function(data) {
				console.log(data);
				course.errors = data.eMessages;
				for (var i = 0; i < data.status.length; i ++) {
					if (data.status[i].messageSeverity == 'S' || data.status[i].messageSeverity == 'I') {
						course.successMessages.push(data.status[i]);
						if (data.status[i].messageDesc.indexOf("W") > -1) {
							course.enrollStatusCode = "WD";
							course.enrollStatusDescr = "Withdrawn";
						} else {
							course.hide = true;
							
							$scope.minEnrolledCredits -= course.stuClass.unitsMinimum;
							$scope.maxEnrolledCredits -= course.stuClass.unitsMaximum;
						}
					} else if (data.status[i].messageSeverity == 'E') {
						course.errorMessages.push(data.status[i]);
					} else {
						course.warningMessages.push(data.status[i]);
					}
				}
				
				if (course.hide) {
					$interval(function() {
						for (i = 0; i < $scope.schedule.length; i++) {
							if ($scope.schedule[i].ppSearchIdSisGw == course.ppSearchIdSisGw) {
								$scope.schedule.splice(i, 1);
								break;
							}
						}
					}, 7000, 1, true);
				}
				course.actionPending = "no";
			}, function(data) {
				course.errors.push({"description":"An unexpected error has occurred.  Please try again."});
				course.actionPending = "no";
			});
		} else {
			course.errorMessages.push({"messageDesc":"You are not allowed to drop the class."});
			course.actionPending = "no";
		}
	};
	
	$scope.editClass = function(grading, course){
		console.log("setting grading to " + grading + " for the following from the schedule:");
		console.log(course);
		course.successMessages = [];
		course.warningMessages = [];
		course.errorMessages = [];
		course.errors = [];
		course.actionPending = "yes";
		
		$scope.resultPromise = enrollmentService.basic('edit-class', 
				{'ppid': course.ppSearchIdSisGw, 'term': course.termId, 'career': $scope.selectedCareer, 'grading': grading});
		
		$scope.resultPromise.then(function(data){
			console.log(data);
			course.errors = data.eMessages;
			for (var i = 0; i < data.status.length; i ++) {
				if (data.status[i].messageSeverity == 'S' || data.status[i].messageSeverity == 'I') {
					course.gradingBasisCode = grading;
					course.successMessages.push(data.status[i]);
				} else if (data.status[i].messageSeverity == 'E') {
					course.errorMessages.push(data.status[i]);
				} else {
					course.warningMessages.push(data.status[i]);
				}
			}
			course.actionPending = "no";
		}, function(data) {
			course.errors.push({"description":"An unexpected error has occurred.  Please try again."});
			course.actionPending = "no";
		});
	};
	
	/* Functions Which Retrieve Courses */
    $scope.getSchedule = function(){
    	console.log("getting schedule");
        $scope.progressbarschedule = "";
    	
    	var timer = $interval(function() {
    		$scope.progressschedule = $scope.progressschedule + ((1000 - $scope.progressschedule) / 1.5) / 75;
    	}, 15, 0, true);
    	
    	$scope.loaded.schedule = false;
    	$scope.resultPromise = enrollmentService.basic('get-schedule', {term: $scope.form.termSelect,
			career: $scope.selectedCareer});
		
		$scope.resultPromise.then(function(data){
			console.log(data);
			$scope.schedule = data.classes;
			$scope.enrolledMessages = data.eMessages;
			$scope.enrolledSuccess = data.success;
			$scope.waitlistedClasses = data.waitlistedClasses;
			$scope.minEnrolledCredits = data.minCredits;
			$scope.maxEnrolledCredits = data.maxCredits;
			$scope.schedule = $scope.loadRealTime($scope.schedule);
	    	$scope.loaded.schedule = true;
			
			if($scope.schedule == []){
				$scope.message = "You are not enrolled in any classes";
			}else{
				console.log("Your classes:");
				for (i=0; i<$scope.schedule.length; i++){
					console.log($scope.schedule[i].ppSearchIdSolr + " ");
				}	
			}
			$scope.killProgressSchedule(timer);
		}, function(data) {
			$scope.scheduleErrors.push({"description":"An unexpected error has occurred.  Please try again."});
			$scope.majorActionPending = "no";
			$scope.killProgressSchedule(timer);
		});
    };
    
    $scope.killProgressSchedule = function(timer) {
    	$scope.progressschedule = 1000;
        if (angular.isDefined(timer)) {
        	$interval.cancel(timer);
      	}
        $interval(function() {$scope.progressbarschedule = "progressdone";$scope.progressschedule = 0;}, 1000, 1, true);
    }
    
    $scope.getCart = function(){
    	console.log("getting cart");
        $scope.progressbarcart = "";
    	
    	var timer = $interval(function() {
    		$scope.progresscart = $scope.progresscart + ((1000 - $scope.progresscart) / 1.5) / 75;
    	}, 15, 0, true);
    	
    	$scope.loaded.cart = false;
    	$scope.resultPromise = enrollmentService.basic('get-cart', {term : $scope.form.termSelect});
		
		$scope.resultPromise.then(function(data) {
			console.log(data);
			$scope.cart = data.classes;
			$scope.cartMessages = data.eMessages;
			$scope.cartSuccess = data.success;
			$scope.cart = $scope.loadRealTime($scope.cart);
	    	$scope.loaded.cart = true;
	    	$scope.killProgressCart(timer);
		}, function(data) {
			$scope.cartErrors.push({"description":"An unexpected error has occurred.  Please try again."});
			$scope.majorActionPending = "no";
	    	$scope.killProgressCart(timer);
		});
    };
    
    $scope.killProgressCart = function(timer) {
    	$scope.progresscart = 1000;
        if (angular.isDefined(timer)) {
        	$interval.cancel(timer);
      	}
        $interval(function() {$scope.progressbarcart = "progressdone";$scope.progresscart = 0;}, 1000, 1, true);
    }
    
    $scope.swapClass = function(course){
		$location.search('oldppId', course.ppSearchIdSisGw);
		$location.search('term', course.termId);
		
		$location.path('/swap');
	};
	
    $scope.swapRedirect = function(){
    	$location.search('term', $scope.form.termSelect);
    	$location.path('/swap');
    };

    /* Loading Functions */
    $scope.loadClasses = function(){
    	$scope.schedule = [];
    	$scope.cart = [];
    	$scope.scheduleErrors = [];
    	$scope.cartErrors = [];
    	$scope.minEnrolledCredits = 0;
    	$scope.maxEnrolledCredits = 0;
    	$scope.cartReady = false;
    	$scope.enrolledReady = false;
    	
    	$scope.currentTerm = $scope.form.termSelect;
    	
    	$scope.getCart();
    	$scope.getSchedule();
    };
    
    $scope.loadRealTime = function(classList){
    	var updatedList = loadRealTime(classList, $q, $http);
    	return updatedList;
    };
    
    /* Setter Functions*/
    $scope.sendDrop = function(course) {
    	$scope.dropCourse = course;
    };
    
    $scope.sendGrading = function(course) {
    	$scope.grading.course = course;
    	$scope.grading.option = course.gradingBasisCode;
    };
    
    $scope.sendDelete = function(course) {
    	$scope.deleteCourse = course;
    };
    
    /* Code Resolving Functions */
	$scope.resolveTerms = function( termCode ) {
    	if (termCode == null ) {
    		if ($scope.defaults.term == null) {
    			return "Loading";
    		} else {
    			$scope.form.termSelect = $scope.defaults.term;
    			$scope.loadClasses();
    			return "Loading";
    		}
    	} else {
    		for (var i = 0; i < $scope.fields.termField.length; i++) {
    			if ($scope.fields.termField[i].strm == termCode) {
    				return $scope.fields.termField[i].descr;
    			}
    		}
    	}
    };
    
    $scope.resolveCareer = function() {
    	if ($scope.user.termsActivated == null) {
    		return "Loading";
    	} else {
    		if ($scope.user.termsActivated[$scope.form.termSelect] == null) {
    			return "Not Term Active";
    		} else {
    			if ($scope.user.termsActivated[$scope.form.termSelect].length > 1) {
    			} else if ($scope.user.termsActivated[$scope.form.termSelect].length == 1) {
    				$scope.selectedCareer = $scope.user.termsActivated[$scope.form.termSelect][0];
    			} else {
    				$scope.selectedCareer = "UGRD";
    			}
    			return "Loaded";
    		}
    	}
    };
    
    $scope.resolveComponent = function(course) {
    	if ($scope.fields.componentField != null) {
    		for( var i = 0 ; i < $scope.fields.componentField.length; i++){
    			if ($scope.fields.componentField[i].componentId == course.stuClass.component) {
    				return $scope.fields.componentField[i].description;
    				break;
    			}
    		}
    		
    		return "";
    	} else {
    		return "Loading";
    	}
    };
    
    $scope.resolveGradingBasis = function(gradingBasisCode) {
    	if ($scope.fields.gradingField != null) {
    		for( var i = 0 ; i < $scope.fields.gradingField.length; i++){
    			if ($scope.fields.gradingField[i].grading == gradingBasisCode) {
    				return $scope.fields.gradingField[i].description;
    				break;
    			}
    		}
    		
    		return "";
    	} else {
    		return "Loading";
    	}
    };
    
    $scope.resolveCareerCode = function(careerCode) {
    	if ("UGRD" == careerCode) {
    		return "Undergraduate";
    	} else if ("GRAD" == careerCode) {
    		return "Graduate";
    	} else {
    		return "Invalid Career";
    	}
    };
    
    $scope.getTextbooksSchedule = function(){
    	$scope.scheduleErrors = [];
    	if($scope.schedule.length > 0){
    		$scope.bookstore = "";
        	for(var i = 0; i < $scope.schedule.length; i++){
        		$scope.bookstore += $scope.setBook($scope.schedule[i].stuClass);
        	}
        	console.log($scope.bookstore);
        	//$scope.gotoTextbooks();
        	$scope.sendForm = true;
    	}else{	
        	$scope.scheduleErrors.push({"description":"You do not have classes in your schedule. Please enroll in classes, and try again."});
        	$scope.sendForm = false;
    	}
    }
    
    $scope.getTextbooksCart = function(){
    	$scope.cartErrors = [];
    	if($scope.cart.length > 0){
        	$scope.bookstore = "";
        	for(var i = 0; i < $scope.cart.length; i++){
        		if($scope.cart[i].checked){
        			$scope.bookstore += $scope.setBook($scope.cart[i].stuClass);
        		}
        	}
        	console.log($scope.bookstore);
        	//$scope.gotoTextbooks();
        	$scope.sendForm = true;
    	}else{
    		$scope.cartErrors.push({"description":"You do not have classes in your cart. Please add classes, and try again."});
    		$scope.sendForm = false;
    	}
    }
    
    /* Textbook Functions */
    var convertBookTerm = function(term) {
    	var bookTerm = "";
    	var year = parseInt(term.charAt(1) + term.charAt(2));
    	
    	p = term.charAt(3);
    	if (p == '1'){
    		bookTerm = bookTerm + "F";
    	} else if (p == "2") {
    		bookTerm = bookTerm + "T";
    		year = year + 1;
    	} else if (p == "3") {
    		bookTerm = bookTerm + "T";
    		year = year + 1;
    	} else if (p == "5") {
    		bookTerm = bookTerm + "W";
    		year = year + 1;
    	} else if (p == "8") {
    		bookTerm = bookTerm + "A";
    		year = year + 1;
    	}
    	
    	bookTerm = bookTerm + year;
    	
    	return bookTerm;
    };
    
    /**
     * <courses><course num='{{ myClassCtrl.bookstore.num }}' dept='{{ myClassCtrl.bookstore.dept }}' sect='{{ myClassCtrl.bookstore.sect }}' term='{{ myClassCtrl.bookstore.term }}' /></courses>
     */
    $scope.setBook = function(course) {
    	var book = {};
    	book.num = (course.subject + course.catalogNumber).replace(/\s+/g, '');
    	book.dept = course.academicGroupShort;
    	book.term = convertBookTerm(course.startingTerm);
    	book.sect = course.section;
    	return "<course num='" + book.num + "' dept='" + book.dept + "' sect='" + book.sect + "' term='" + book.term + "' />"
    };
    
    $scope.gotoTextbooks = function() {
    	if($scope.sendForm){
    		document.books.submit();
    	}
    };
});