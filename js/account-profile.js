/**
 * 
 */

app.controller('accountProfileController', function($scope,$http){

});

// ACCOUNT ACTIVITY (templates/account-activity.html)
	
	function AccountProfileChart() {
		
		var privateData = {};
		
		this.drawAccountProfileChart = function (containerId, yearValueLeft, yearValueRight, displayData) {
			
			privateData = {
					yearValueLeft: yearValueLeft,
					yearValueRight: yearValueRight,
					displayData: displayData
			}
			$('#'+containerId).highcharts({
			    
	            chart: {
	                type: 'column'
	            },
	    
	            title: {
	                text: ''
	            },
	    
	            xAxis: {
	                categories: [privateData.yearValueLeft, privateData.yearValueRight]
	            },
	    
	            yAxis: {
	                allowDecimals: false,
	                min: 0,
	                title: {
	                    text: ''
	                }
	            },
	    
	            tooltip: {
	                formatter: function() {
	                    return '<b>'+ this.x +'</b><br/>'+
	                        this.series.name +': '+ this.y +'<br/>'+
	                        'Total: '+ this.point.stackTotal;
	                }
	            },
	            
	            colors: [
	                     '#ffae00', 
	                     '#f68500'
	                  ],
	    
	            plotOptions: {
	                column: {
	                    stacking: 'normal'
	                },
	                series: {
	                    colorByPoint: true,
	                    dataLabels: {
                            enabled: true,
                            format: '${point.y: 0.2f}',
                            y: 100
                        }
	                }
	            },
	    
	            series: [{
	                name: '2014',
	                data: [displayData[0], displayData[1]],
	                pointWidth: 116
	            }]
	        });
		}
	}
	
	var c1 = new AccountProfileChart();
	c1.drawAccountProfileChart("container1", "2014 YTD", "2013", [40, 50]);
	
	var c2 = new AccountProfileChart();
	c2.drawAccountProfileChart("container2", "2016 YTD", "2015", [20, 50]);
	
	var c3 = new AccountProfileChart();
	c3.drawAccountProfileChart("container3", "2018 YTD", "2017", [20, 50]);
	
	$(".highcharts-legend, .highcharts-yaxis-labels, .highcharts-grid").hide();
	
	
	
	
	
	
	
	
	
