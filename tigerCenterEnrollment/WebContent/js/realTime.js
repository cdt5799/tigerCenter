/**
 * 
 */

	var r = new Array();

    loadRealTime = function(courses, q, http) {
    	
    	if(courses == null){
    		return;
    	}
    	
    	var step = 10;
    	var k = 0;
    	
    	for (k = 0; k < courses.length + step; k += step){
    		var def = q.defer();
    		r.push(def);
    		var ppIds = new Array();
    		
    		for (var j = 0; (j < step) && (k + j < courses.length); j++) {
    			ppIds.push(courses[j + k].ppSearchIdSisGw);
    			if(courses[j + k].related || courses[j + k].hasAutoEnroll){
    				for(var i = 0; i < courses[j + k].relatedClasses.length; i++){
    					ppIds.push(courses[j + k].relatedClasses[i].ppSearchIdSisGw);
    				}
    			}
    		}
    		
    		console.log(ppIds);
    		
    		http({method: 'GET', url: 'realtime', params: {
    			ppId: ppIds, step: k
    		}, timeout: def.promise}).then(function(res) {
    			var updates = res.data.updates;
    			console.log("Length of Courses: " + courses.length);
    			for(var i = 0; i < courses.length; i++) {
    				if(updates.length == []){
    					break;
    				}
    				var counter = 0;
    				var courseDone = false;
    				var relatedDone = false;
    				while(counter < updates.length){
    					var updateDone = false;
    					//Course not null and update not null
    					if (updates[counter] != null && courses[res.data.step + i] != null) {
        					console.log("PPIDS:  " + courses[res.data.step + i].ppSearchIdSisGw + " " + updates[counter].ppSearchId);
        					console.log("Matching PPIDS? " + (courses[res.data.step + i].ppSearchIdSisGw == updates[counter].ppSearchId));
        					//Update == Course
        					if (courses[res.data.step + i].ppSearchIdSisGw == updates[counter].ppSearchId){
        						courses[res.data.step + i].stuClass.enrollStatus = updates[counter].enrollStatus;
            					courses[res.data.step + i].stuClass.enrollmentTotal = updates[counter].enrollmentTotal;
            					courses[res.data.step + i].stuClass.enrollmentCap = updates[counter].enrollementCap;
            					courses[res.data.step + i].stuClass.waitTotal = updates[counter].waitTotal;
            					courses[res.data.step + i].stuClass.waitCap = updates[counter].waitCap;
            					courses[res.data.step + i].realtimeLoaded = true;
            					
            					console.log("Removing Update: " + updates[counter].ppSearchId);
                				updates.splice(counter, 1);
            					updateDone = true;
            				}
        					
        					console.log("Related? = " + courses[res.data.step + i].related);
        					console.log("Auto Enroll? = " + courses[res.data.step + i].hasAutoEnroll);
        					console.log("Updated? = " + updateDone);
        					if(!(courses[res.data.step + i].related || courses[res.data.step + i].hasAutoEnroll) && updateDone){
        						console.log("Move to the next course");
        						courseDone = true;
        						relatedDone = true;
        					}else if((!(courses[res.data.step + i].related || courses[res.data.step + i].hasAutoEnroll) && !updateDone) || ((courses[res.data.step + i].related || courses[res.data.step + i].hasAutoEnroll) && relatedDone)){
        						console.log("Stay on the same course")
        					}else{
        						console.log("Doing Related Things");
        						if(updateDone && courses[res.data.step + i].realtimeLoaded){
        							courseDone = true;
        							while(updates[counter] == null){
        								console.log("Null Update Before Related Classes");
        								updates.splice(counter, 1);
        								if(updates.length == 0){
        									break;
        								}
        							}
        						}
        						var success = 0;
        						for(var x = 0; x < courses[res.data.step + i].relatedClasses.length; x++){
    								console.log("Related class: " + courses[res.data.step + i].relatedClasses[x].ppSearchIdSisGw + " Update: " + updates[counter].ppSearchId);
        							if (courses[res.data.step + i].relatedClasses[x].ppSearchIdSisGw == updates[counter].ppSearchId){
        								console.log("Updated Related class: " + courses[res.data.step + i].relatedClasses[x].ppSearchIdSisGw);
                						courses[res.data.step + i].relatedClasses[x].stuClass.enrollStatus = updates[counter].enrollStatus;
                    					courses[res.data.step + i].relatedClasses[x].stuClass.enrollmentTotal = updates[counter].enrollmentTotal;
                    					courses[res.data.step + i].relatedClasses[x].stuClass.enrollmentCap = updates[counter].enrollementCap;
                    					courses[res.data.step + i].relatedClasses[x].stuClass.waitTotal = updates[counter].waitTotal;
                    					courses[res.data.step + i].relatedClasses[x].stuClass.waitCap = updates[counter].waitCap;
                    					courses[res.data.step + i].relatedClasses[x].realtimeLoaded = true;
                    					success += 1;
                    					console.log("Removing Update due to Related Class: " + updates[counter].ppSearchId);
            	        				updates.splice(counter, 1);
                					}
        						}
        						
        						if(success == courses[res.data.step + i].relatedClasses.length){
        							relatedDone = true;
        						}
        					}
        					
        				}else if (courses[res.data.step + i] != null) {
        					console.log("Found a null update");
        					updates.splice(counter, 1);
        				}else{
        					console.log("Both Course and Update Were Null");
        					updates.splice(counter, 1);
        					break;
        				}
    					
    					if(courseDone && relatedDone){
    						console.log("Done with the course and relatedClasses");
    						break;
    					}else{
    						counter++;
    					}
    				}
    				
    				//check to see if the course was loaded
    				if(courses[res.data.step + i] != null){
    					if(!courses[res.data.step + i].realtimeLoaded){
    						console.log("No Update Found for " + courses[res.data.step + i].ppSearchIdSisGw + ". Setting Realtime True")
        					courses[res.data.step + i].realtimeLoaded = true;
        				}
    					
    					if(courses[res.data.step + i].related || courses[res.data.step + i].hasAutoEnroll){
    						for(var y = 0; y < courses[res.data.step + i].relatedClasses.length; y++){
    							if (!courses[res.data.step + i].relatedClasses[y].realtimeLoaded){
    								console.log("No Update Found for related " + courses[res.data.step + i].relatedClasses[y].ppSearchIdSisGw + ". Setting Realtime True")
    								courses[res.data.step + i].relatedClasses[y].realtimeLoaded = true;
            					}
    						}
    					}
    				}
    			}
    			
	    		def.resolve();
	    		r.pop();
    		});
    	}
    	
    	return courses;
    };