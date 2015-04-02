/**
 * 
 */

var app = angular.module("enrollApp");

app.filter('regexString', function() {
	return function(items, regex, eval, secondAttr, thirdAttr) {
		var patt = new RegExp(regex);
	    var out = new Array();
	    angular.forEach(items, function(item) {
	    	if (eval == "T") {
	    		if(patt.test(item) && secondAttr == thirdAttr)
	    			out.push(item);
	    	} else {
	    		if(!patt.test(item) || secondAttr != thirdAttr)
	    			out.push(item);
	    	}
	    });
	    return out;
	};
});

var replaceMessage = function(classList, message, match, field){
	for (var j = 0; j < classList.length; j++) {
	   	console.log(classList[j].classNumber + " == " + match);
	   	if (classList[j].classNumber == match) {
	   		replaceText = classList[j].stuClass.subject + " " + classList[j].stuClass.catalogNumber + " " + classList[j].stuClass.section;
	   		console.log(replaceText);
	   		
	   		return replaceText;
	   	}
	   	
	   	if(classList[j].related){
	   		for(var k = 0; k < classList[j].relatedClasses.length; k++){
	   			console.log(classList[j].relatedClasses[k].classNumber + " == " + match);
	   		   	if (classList[j].relatedClasses[k].classNumber == match) {
	   		   		replaceText = classList[j].relatedClasses[k].stuClass.subject + " " + classList[j].relatedClasses[k].stuClass.catalogNumber + " " + classList[j].relatedClasses[k].stuClass.section;
	   		   		console.log(replaceText);
	   		   		return replaceText;
	   		   	}
	   		}
	   	}
	}
	return "";
};

app.filter("resolveMessages", function(){
	return function(message, field, cart, schedule){
		if(message != undefined && message.length != 0){
			console.log("message: " + message.length + " field: " + field + " cart: " + cart + "schedule: " + schedule );
		   	var myRegex = /([0-9]{5})/g;
		   	var replaceText = "";
		   	var matches;
		   	var match;
		   	for(var i = 0; i < message.length; i++){
		   		if(!message[i].filtered){
		   			console.log("In first for loop");
		   			replaceText = "";
		   			matches = {}
		   			match = myRegex.exec(message[i][field]);
			   		
		   			while (match != null ) {
			   			console.log("In while loop");
			   			
			   			replaceText = replaceMessage(schedule, message[i], match[0], field);
				    	
			   			if(replaceText != ""){
			   				matches[match[0]] = replaceText;
			   			}else{
			   				replaceText = replaceMessage(cart, message[i], match[0], field);
			   				
			   				if(replaceText != ""){
			   					matches[match[0]] = replaceText;
			   				}
			   			}
			   			
			   			match = myRegex.exec(message[i][field]);
				   	}
			   		
			   		console.log(matches);
			   		for(var key in matches){
			   			if(!(message[i][field].indexOf(matches[key]) > -1)){
			   				message[i][field] = message[i][field].replace(new RegExp(key, 'g'), key + " ( " + matches[key] + " ) ");
			   			}
			   		}
			   		
			   		message[i].filtered = true;
		   		}
		   	}
		}
	    return message;
	};
});