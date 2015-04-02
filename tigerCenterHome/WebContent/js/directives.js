var app = angular.module('tigerHome');

app.directive ("dateChooser", function(){
	var directive = {};
	directive.restrict = 'AEC';
	directive.priority = 1001;
	directive.link = function($scope, element){
		element.datepicker({
			showButtonPanel:true,
			showOn: "both",
		    buttonImage: "images/calendar.png",
		    buttonImageOnly: true,
		    showOtherMonths: true,
		    selectOtherMonths: true,
		    changeMonth: true,
		    changeYear: true
		});
	};
	console.log("working");
	return directive;
	
});