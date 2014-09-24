/**
 *
 */

app.controller('accountActivityController', ['$scope', '$http', function($scope,$http){
	$http({
        method:'get',
        url:"js/json/account-activity.json"
    })
    .success(function(jsonData){
    	var monthNames = [ "January", "February", "March", "April", "May", "June", 
                           "July", "August", "September", "October", "November", "December" ];
        var accountActivity = new AccountActivityChart("activityGraphContainer", jsonData, {"displayMonth": "MAY"});
    	accountActivity.drawAccountActivityChart();
    	var sortedDate = getSortedDate(jsonData);
    	//$scope.displayLeftDate = sortedDate.slice(-1)[0].substring(0, sortedDate.slice(-1)[0].length - 4).toUpperCase();
    	$scope.displayLeftDate = monthNames[new Date(sortedDate[0]).getMonth()].toUpperCase();
    });
}]);



function AccountActivityChart(activityContainer, inputData, configParameters) {
	
	var recentDate = getSortedDate(inputData);
	this.drawAccountActivityChart = function () {
		$('.'+activityContainer).highcharts({
			chart: {
				type: 'scatter',
				backgroundColor: null,
				zoomType: 'x'
			},
			credits: {
		        text: '',
		        href: ''
		    },
		    title: {
	            text:   '',
	            x: -20
	        },
	        subtitle: {
	        	text:   '',
	            x: -20
	        },
	        xAxis: {
	        	gridLineWidth: 0,
                minorGridLineWidth: 0,
                lineColor: 'transparent',
	            type: 'datetime',
	            maxZoom: 30 * 24 * 3600000,
	            tickInterval: 24 * 3600 * 1000,
	            tickLength: 0,
	            dateTimeLabelFormats: {
	            	day: '%e'
	            },
	            labels: {
	            	y: 24,
	            	x: 10,
	                style: {
	                    fontSize: '1.6em',
	                    fontWeight: 'normal',
	                    fontFamily: 'standardCondensed',
	                    color: '#bcbdbd'
	                }
	            },
	            plotLines : [{
					value : (function() {
						//return Date.parse(recentDate[0] + 'UTC'); 
					})(),
					color : 'rgba(57, 72, 77, 0.4)',
					dashStyle : 'solid',
					width : 32				
				}]
	        },
	        yAxis: {
	        	title: {
	        		text:   ''
		        },
		        tickLength: 16,
                tickWidth: 1,
                offset: 20,
		        opposite: true,
		        min: 0,
		        plotLines: [{
	                value: 0,
	                width: 0,
	                color:  '#808080'
	            }],
	            labels: {
	                format: '${value}',
	                y: 24,
	                x: 0,
	                style: {
	                    fontSize: '2em',
	                    fontWeight: 'normal',
	                    fontFamily: 'standardCondensed',
	                    color: '#bcbdbd'
	                }
		        }
		    },		   
		    tooltip: {
                formatter: function() {
                    return  '<b>' + this.point.descriptionText +'</b><br/>' +
                        	Highcharts.dateFormat('%e %b, %Y', new Date(this.x)) +
                        	'<b> ' + '$' +this.y+ '</b>';
                },
                backgroundColor: '#ffffff',
                borderColor: '#000000'
            },
		    legend: {
		    	layout: 'vertical',
		        align: 'right',
		        verticalAlign: 'middle',
		        borderWidth: 0
		    },
		    
		    series: (function() {
		    	var seriesArray = new Array();
		    	var intArray = [];
		    	var rdmArray = [];
		    	var divArray = [];
		    	
		    	var combinedArray = [];
		    	
		    	// Define the color types of each activity type data
		    	var colorTypes = [
		    	                  '#5f97ba', // for INT activity type data
		    	                  '#c7edc0', // for RDM activity type data		    	                  
		    	                  '#fc9026'  // for DIV activity type data
		    	                  ];
		    	
		    	// Defining the names for the Activity Types
		    	var activityTypeName = ['INT Activity Type', 'RDM Activity Type', 'DIV Activity Type'];
		    	
		    	// Creating arrays of each activity types
		    	$.each(inputData, function(k1, v1) {
		    		$.each(v1.activityData, function(k2, v2) {
		    			switch(v2.activityType){
			    			case 'intType':
			    				intArray.push({
			    						"activityDate": v2.activityDate,
			    		                "activityAmount": v2.activityAmount,
			    		                "activityType": v2.activityType,
			    		                "activityDescription": v2.activityDescription
			    				});
			    			    break;
			    			
				    		case 'rdmType':
			    				rdmArray.push({
			    						"activityDate": v2.activityDate,
			    		                "activityAmount": v2.activityAmount,
			    		                "activityType": v2.activityType,
			    		                "activityDescription": v2.activityDescription
			    				});
			    			    break;
			    			
				    		case 'divType':
			    				divArray.push({
			    						"activityDate": v2.activityDate,
			    		                "activityAmount": v2.activityAmount,
			    		                "activityType": v2.activityType,
			    		                "activityDescription": v2.activityDescription
			    				});
			    			    break;
			    			}
		    		});
		    	});
		    	
		    	// Pushing all arrays into combinedArray
		    	Array.prototype.push.apply(combinedArray, [intArray, rdmArray, divArray]);
		    	
		    	for(var k=0; k<combinedArray.length; k++) {
		    		
		    		seriesArray.push({
		    			shadow: true,
			    		marker: {
			    			symbol: 'circle',
			    			radius: 8
			    		},
			    		name: (function() {
			    			return activityTypeName[k];
			    		})(),
			    		color: colorTypes[k],
			    		pointInterval: 24 * 3600 * 1000,
			    		data: (function() {
		            		 var arrayForData = [];
		            		 for(var i=0; i<combinedArray[k].length; i++) {
		            			 //console.log(i + ":" + new Date(combinedArray[k][i].activityDate.split("/")[0],combinedArray[k][i].activityDate.split("/")[1], combinedArray[k][i].activityDate.split("/")[2]));
		            			 arrayForData.push({
		            				 x: new Date(combinedArray[k][i].activityDate.split("/")[0],combinedArray[k][i].activityDate.split("/")[1], combinedArray[k][i].activityDate.split("/")[2]),
		            				 //x: Date.parse(combinedArray[k][i].activityDate + 'UTC'), // This is old code: buggy on UNIX system (remove this line)
		            				 y: parseInt(combinedArray[k][i].activityAmount, 10),
		            				 descriptionText: combinedArray[k][i].activityDescription
		            			 });
		            		 }
		            		 return arrayForData;
		            	 })()
			    	});
		    	}
		    	
		    	return seriesArray;
		    })()		    
		    
		    },function(chart){
		        for(var x=0; x<chart.series.length; x++) {
		        	$.each(chart.series[x].data,function(i,d){
			            this.graphic.shadow({
			                opacity: 1,
			                width: 2,
			                offsetX: 2,
			                offsetY: 2
			            });
			        });
		        }
		        
		    });
		}
	
	}


// Returns the most recent date of the data
// A vertical plot line can be made on this most recent date data
function getSortedDate(inputData) {
	var accountActivityDateArray = [];
	
	// Iterates on all the JSON dates and creates an array with that dates
	$.each(inputData, function(k1, v1) {
		$.each(v1.activityData, function(k2, v2) {
			accountActivityDateArray.push(v2.activityDate);
		});
	});
	
	// Sorting the date: accountActivityDateArray[0] will be the most recent date
	var sortedDate = function (date1, date2) {
		return (new Date(date1) > new Date(date2)) ? -1 : (new Date(date1) < new Date(date2)) ? 1 : 0;
	};
	 
	accountActivityDateArray.sort(sortedDate);
	return accountActivityDateArray;
}
