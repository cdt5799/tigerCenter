/**
 * 
 */
var app = angular.module('tigerHome');

app.controller('indexController', function($scope, $http, $filter, homeService) {
	var matchISO8061 = function(time) {
		if (time == null) {
			return "00:00:00";
		} else {
			var split = time.split(":");
    		if (split.length > 1) {
    			if (time.indexOf("PM") > -1) {
    				split[0] = parseInt(split[0]) + 12;
        		}
    			if (split[1].length > 2) {
    				return split[0] + ":" + split[1].substring(0, 2) + ":00"
    			} else {
    				return split[0] + ":" + split[1] + ":00"
    			}
    		} else {
    			return "00:00:00";
    		}
		}
    };
    
	this.init = function() {
		console.log("getting home info");
		$scope.resultPromise = homeService.basic('tiger-home', {});
		
		$scope.resultPromise.then(function(data) {
			console.log(data);
			if (data.advisors == null || data.holds == null || data.enrollmentApps == null
					|| data.enrolledEvents == null || data.waitlistEvents == null 
					|| data.holiday == null || data.nonMeetingClasses == null) {
				$scope.error = {id:"THBAD", description:"Sorry, but I couldn't process your request at this time. If the problem persists please check the support page and provide this code.", severity:1};
			} else {
				$scope.advisors = data.advisors;
				$scope.holds = data.holds;
				$scope.enrollmentApps = data.enrollmentApps;
				$scope.enrolledEvents = data.enrolledEvents;
				$scope.waitlistedEvents = data.waitlistEvents;
				$scope.holidayEvents = data.holiday;
				$scope.nonMeetingClasses = data.nonMeetingClasses;
				$scope.eventSources.push($scope.enrolledEvents, $scope.waitlistedEvents, $scope.holidayEvents);
			}
			$scope.loaded = true;
		}, function(data) {
			console.log(data);
			$scope.error = {id:"THFAIL", description:"Sorry, but I couldn't process your request at this time. If the problem persists please check the support page and provide this code.", severity:1};
			$scope.loaded = true;
		});
	};
	
	$scope.defaultEvents = [{ 	title  : 'End of the World', 
								location : ['Death Star'],
								locationShort : ['Death Star'],
								instructor : ['Lord Vader'],
								courseNum : '(Brought to you by EA Games)<br/>&quot;Challenge Everything&quot;',
								componentDescr : '(Doing the Kessel Run in 12 Parsecs)',
								startTime : 'Outer Rim Terr.',
								endTime : 'Space Station Koda',
								start  : '9999-12-31T19:59:59', 
								end : '9999-12-31T23:59:59'},
	                        { 	title  : 'Insert Big Bang Here', 
								location : ['Center of The Universe'],
								locationShort : ['Center of The Universe'],
								instructor : ['Sheldon Cooper'],
								courseNum : 'It was a dark and stormy night',
								componentDescr : '(Which came first bang or big?)',
								startTime : 'To Infinity',
								endTime : 'And Beyond',
								start  : '0100-01-01T03:00:00', 
								end : '0100-01-01T07:00:00'}]
	
	// event color must be changed in java
	// src->edu.rit.tigerhome->home->bean->MeetingEventData.java
	$scope.enrolledEvents = [];
	$scope.waitlistedEvents = [];
	$scope.nonMeetingClasses = [];
	$scope.advisors = [];
	$scope.enrollmentApps = [];
	$scope.holds = [];
	$scope.loaded = false;
	
	$scope.form = {};
	$scope.filter = {};
	$scope.filter.militaryTime = false;
	$scope.filter.waitlist = true;
	$scope.filter.monday = true;
	$scope.filter.tuesday = true;
	$scope.filter.wednesday = true;
	$scope.filter.thursday = true;
	$scope.filter.friday = true;
	$scope.filter.saturday = true;
	$scope.filter.sunday = true;
	$scope.filter.holiday = true;
	
	var monthNames = [ "January", "February", "March", "April", "May", "June",
	                   "July", "August", "September", "October", "November", "December" ];
	$scope.month = monthNames[(new Date()).getMonth()] + " " + (new Date()).getFullYear();
	
	$scope.eventSources = [$scope.defaultEvents];
	
	$scope.options = {
	    	minTime : '0:00:00',
	    	maxTime : '24:00:00',
	    	contentHeight: 600,
	    	slotDuration : '00:15:00',
	    	scrollTime : '08:00:00',
	    	hiddenDays : [],
			defaultView : 'agendaWeek',
			axisFormat : 'h(:mm)a', // uppercase H for 24-hour clock
			header : false,
			eventRender : function(event, element) {
				var tool = "<div class='fc-tooltip-title'>" + event.title + 
					"</div><div class='fc-tooltip-body'>" + event.courseNum + "<br/>";
				
				for (var i = 0; i < event.instructor.length; i++) {
					tool = tool + event.instructor[i] + "<br/>";
				}
				
				for (var i = 0; i < event.location.length; i++) {
					tool = tool + event.location[i] + "<br/>";
				}
				
				tool = tool + event.startTime + " - " + event.endTime + "<br/>" + 
				$scope.resolveComponent(event) + "</div>";
				
		        element.attr('title', tool);
		        element.tooltip({
		            content: tool,
		            position: { my: "left bottom-30", at: "left top"}
		        });
		        
		        var description = "<div class='fc-description'>";
		        for (var i = 0; i < event.locationShort.length; i++) {
		        	if (i < event.locationShort.length - 1) {
			        	description = description + event.locationShort[i] + " / ";
		        	} else {
			        	description = description + event.locationShort[i];
		        	}
				}
		        description = description + "</div>";
		        element.find(".fc-content").append(description);
		    }
	};

	// hiddenDays --> removes column for the day if hidden
	$scope.getHiddenDays = function(){
		var hidden = new Array();
		if(!$scope.filter.sunday){
			hidden.push(0);
		}if(!$scope.filter.monday){
			hidden.push(1);
		}if(!$scope.filter.tuesday){
			hidden.push(2);
		}if(!$scope.filter.wednesday){
			hidden.push(3);
		}if(!$scope.filter.thursday){
			hidden.push(4);
		}if(!$scope.filter.friday){
			hidden.push(5);
		}if(!$scope.filter.saturday){
			hidden.push(6);
		}
		if (hidden.length > 6) {
			return new Array();
		}
		return hidden;
	}
	
	// toggle military time
	$scope.changeToMilitary = function(){
		// save curr time
		var currDate = $scope.mainCal.fullCalendar( 'getDate' );
		$scope.options.defaultDate = currDate;
		
		// toggle time format
		if($scope.filter.militaryTime){
			$scope.options.axisFormat = 'HHmm'; // uppercase H for 24-hour clock
		} else {
			$scope.options.axisFormat = 'h(:mm)a'; 
		}
		
		// rebuild
		console.log($scope.mainCal.fullCalendar('getView').calendar.options.axisFormat);
		$scope.mainCal.fullCalendar( 'destroy' );
		$scope.mainCal.fullCalendar($scope.options);
	};
	
	$scope.toggleWaitlist = function(){
		if($scope.filter.waitlist){
			$scope.eventSources.push($scope.waitlistedEvents);		
		}else{
			for (i = 0; i < $scope.eventSources.length; i++) {
				if ($scope.eventSources[i] == $scope.waitlistedEvents) {
					$scope.eventSources.splice(i, 1);
					break;
				}
			}
		}
	};
	
	$scope.toggleHolidays = function(){
		if($scope.filter.holiday){
			$scope.eventSources.push($scope.holidayEvents);
		}else{
			for (i = 0; i < $scope.eventSources.length; i++) {
				if ($scope.eventSources[i] == $scope.holidayEvents) {
					$scope.eventSources.splice(i, 1);
					break;
				}
			}
		}
	}
	
	$scope.toggleHiddenDays = function(){
		// save curr time
		var currDate = $scope.mainCal.fullCalendar( 'getDate' );
		$scope.options.defaultDate = currDate;
		
		$scope.options.hiddenDays = $scope.getHiddenDays();
		
		console.log($scope.mainCal.fullCalendar('getView').calendar.options.hiddenDays);
		$scope.mainCal.fullCalendar( 'destroy' );
		$scope.mainCal.fullCalendar($scope.options);
	};
	
	$scope.resolveTerms = function( termCode ) {
    	if (termCode == null ) {
    		if ($scope.fields.termField == null) {
    			return "Loading";
    		} else {
    			$scope.termSelect = $scope.defaults.term;
    			$scope.form.termSelect = $scope.defaults.term;
    			$scope.getFilterDates();
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
    
    $scope.getDateStrings = function() {
    	dates = {};
    	
    	enrollmentApp = {};
    	for (var i = 0; i < $scope.enrollmentApps.length; i++) {
    		if ($scope.enrollmentApps[i].strm == $scope.termSelect) {
    			enrollmentApp = $scope.enrollmentApps[i];
    		}
    	}
    	
    	shoppingApp = {};
    	if ($scope.user.termsActivated != null) {
    		for (var i = 0; i < $scope.fields.shoppingDates.length; i++) {
    			if ($scope.user.termsActivated[$scope.termSelect] != null && $scope.user.termsActivated[$scope.termSelect].length == 1) {
    				if ($scope.fields.shoppingDates[i].career == $scope.user.termsActivated[$scope.termSelect][0] && $scope.fields.shoppingDates[i].term == $scope.termSelect) {
    					shoppingApp = $scope.fields.shoppingDates[i];
    				}
    			} else {
    				if ($scope.fields.shoppingDates[i].career == "UGRD" && $scope.fields.shoppingDates[i].term == $scope.termSelect) {
    					shoppingApp = $scope.fields.shoppingDates[i];
    				}
    			}
    		}
    	}
    	
    	var enrollmentStart = new Date(enrollmentApp.start);
    	var enrollmentEnd = new Date(enrollmentApp.end);
    	var cartStart = new Date(shoppingApp.start);
    	var cartEnd = new Date(shoppingApp.end);
    	
    	if (!$scope.loaded) {
    		dates.enrollStart = "Loading";
    		dates.enrollEnd = "Loading";
    		$scope.enrollTermActive = true;
    	} else if (enrollmentStart.getTime() != undefined && enrollmentStart.getTime() != null && 
    			enrollmentEnd.getTime() != undefined && enrollmentEnd.getTime() != null &&
    			!isNaN(enrollmentEnd.getTime()) && !isNaN(enrollmentEnd.getTime())) {
    		dates.enrollStart = $.format.date(enrollmentStart, "MMMM d, yyyy h:mm a (ddd)");
    		dates.enrollEnd = $.format.date(enrollmentEnd, "MMMM d, yyyy h:mm a (ddd)");
    		$scope.enrollTermActive = true;
    	} else {
    		dates.enrollStart = "You are not term activated.  Please contact the registrar's office if you wish to enroll for the selected term.";
    		dates.enrollEnd = "You are not term activated.  Please contact the registrar's office if you wish to enroll for the selected term.";
    		$scope.enrollTermActive = false;
    	}
    	
    	if (!$scope.loaded) {
    		dates.shoppingStart = "Loading";
    		dates.shoppingEnd = "Loading";
    		$scope.shoppingTermActive = true;
    	} else if (cartStart.getTime() != undefined && cartStart.getTime() != null && 
    			cartEnd.getTime() != undefined && cartEnd.getTime() != null &&
    			!isNaN(cartEnd.getTime()) && !isNaN(cartEnd.getTime())) {
    		dates.shoppingStart = $.format.date(cartStart, "MMMM d, yyyy h:mm a (ddd)");
    		dates.shoppingEnd = $.format.date(cartEnd, "MMMM d, yyyy h:mm a (ddd)");
    		$scope.shoppingTermActive = true;
    	} else {
    		dates.shoppingStart = "You are not term activated.  Please contact the registrar's office if you wish to add clases to your cart for the selected term.";
    		dates.shoppingEnd = "You are not term activated.  Please contact the registrar's office if you wish to add clases to your cart for the selected term.";
    		$scope.shoppingTermActive = false;
    	}
    	
    	if (dates.enrollStart == undefined) {dates.enrollStart = "Error";}
    	if (dates.enrollEnd == undefined) {dates.enrollEnd = "Error";}
    	if (dates.shoppingStart == undefined) {dates.shoppingStart = "Error";}
    	if (dates.shoppingEnd == undefined) {dates.shoppingEnd = "Error";}
    	
    	return dates;
    };
    
    $scope.getFilterDates = function() {
		for (var k = 0; k < $scope.fields.termField.length; k++) {
			for (var l = 0; l < $scope.termStarts.length; l++) {
				if ($scope.termStarts[l].term == $scope.fields.termField[k].strm) {
					$scope.fields.filterTerms.push($scope.fields.termField[k]);
				}
			}
		}
    };
	
    $scope.changeDate = function() {
    	var d = new Date($scope.filter.date);
    	if (!(d.getTime() === d.getTime())) {
    		$scope.mainCal.fullCalendar( 'gotoDate', new Date() );
        	$scope.month = monthNames[(new Date()).getMonth()] + " " + (new Date()).getFullYear();
    	} else {
    		$scope.mainCal.fullCalendar( 'gotoDate', d );
        	$scope.month = monthNames[d.getMonth()] + " " + d.getFullYear();
    	}
    };
    
    $scope.changeTerm = function() {
    	for (var i = 0; i < $scope.termStarts.length; i++) {
    		if ($scope.termStarts[i].term == $scope.form.termSelect) {
    			$scope.filter.date = $scope.termStarts[i].start.substr( 0, 10 );
    			break;
    		}
    	}
    	$scope.changeDate();
    }
    
    $scope.termFilter = function() {
    	return function(item) {
            return item.strm == $scope.form.termSelect;
          };
    };
    
    $scope.changeCalendarView = function(viewName) {
    	$scope.mainCal.fullCalendar( 'changeView', viewName );
    };
    
    $scope.resolveComponent = function(course) {
    	if ($scope.fields.componentField != null) {
    		// components
    		for( var i = 0 ; i < $scope.fields.componentField.length; i++){
    			if ($scope.fields.componentField[i].componentId == course.component) {
    				return $scope.fields.componentField[i].description;
    				break;
    			}
    		}
    		
    		return "";
    	} else {
    		return "Loading";
    	}
    };
    
    $scope.downloadCalendar = function() {
    	var cal = ics();
    	cal.setTimezone('America/New_York');
    	for (var i = 0; i < $scope.enrolledEvents.length; i++) {
        	var e = $scope.enrolledEvents[i];
    		cal.addEvent(e.title, e.instructor, e.location, e.start, e.end);
    	}
    	for (var i = 0; i < $scope.holidayEvents.length; i++) {
        	var e = $scope.holidayEvents[i];
    		cal.addEvent(e.title, e.instructor, e.location, e.start, e.end);
    	}
    	cal.download($scope.user.givenName + " Cal");
    }
    
	this.init();
});