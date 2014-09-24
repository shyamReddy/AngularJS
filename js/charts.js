/**
 * Created by vgudimella on 4/16/2014.
 */

/**
 * Creates and Displays PieAndPlanet Chart.
 * Exposes method drawChart to initiate drawing from the constructor data.
 * @param planetContainerId . id of the div to render the pie
 * @param data data of shape [{key:'', value:10}]
 * @constructor
 */
function PieAndPlanet(planetContainerId, data, config) {

    /////CONSTANTS//////
    var MAX_BUBBLE_SIZE = 60,
        MIN_BUBBLE_SIZE = 30,
        BACKGROUND_COLOR = "#000000",
        CHART_COLORS = ['#4FBADA','#ACECB8','#F9DC80','#A9B0DE','#FF8F4B','#CA676A','#C2D3DA','#87BA82','#FEFFFF'];



	/////CONSTANTS//////
	if (document.getElementById(planetContainerId) == null) {
		console.log("Invalid planetContainerId Passed !!" + planetContainerId);
		return false;
	}

	//setup conatiners for donut and bubble
	var pieContainerId = planetContainerId + "-pie";
	var bubbleContainerId = planetContainerId + "-planet";
	//create the label to show in the center of the donut
	$('<div/>', {
		'id': pieContainerId,
		'class': 'piecontainer'
	}).appendTo($("#" + planetContainerId));

	$('<div/>', {
		'id': bubbleContainerId,
		'class': 'bubblecontainer'
	}).appendTo($("#" + planetContainerId));



    if (config) {
        if (config.maxBubbleSize) {
            MAX_BUBBLE_SIZE = config.maxBubbleSize;
        }
        if (config.minBubbleSize) {
            MIN_BUBBLE_SIZE = config.minBubbleSize;
        }
        if (config.backgroundColor) {
            BACKGROUND_COLOR = config.backgroundColor;
        }
    }

    //INTERNAL STATE
    var planetPosition = $("#" + planetContainerId).position();
    var pieData = [];
    var bubbleData = [];


    //Transform the data to the one that HighCharts Expects {key,x,y,z}
    for (var i = 0; i < data.length; i++) {
        pieData.push({
            name: data[i].key,
            y: data[i].value
        });
        bubbleData.push({
            name: data[i].key,
            x: 0,
            y: i * (MAX_BUBBLE_SIZE + 2),
            z: data[i].value,
            color:CHART_COLORS[i]

        });
        //dummy point to push the bubble left.
        bubbleData.push({
            name: null,
            x: 20,
            y: null,
            z: null,
			customValue:'test'
        });
    }
    //Transform Completed

    this.drawChart = function () {

        //create the label to show in the center of the donut
        $('<span/>', {
            'id': bubbleContainerId + "-textMain",
            'class': 'chartinnertextmain'
        }).appendTo($("#" + pieContainerId).parent());

        $('<span/>', {
            'id': bubbleContainerId + "-textSub",
            'class': 'chartinnertextsub'
        }).appendTo($("#" + pieContainerId).parent());

        // Create the chart
        var pieChart = $('#' + pieContainerId).highcharts({
            colors:CHART_COLORS,
            chart: {
                type: 'pie',
                spacing: [0, 0, 0, 0],
                backgroundColor: null,
                borderRadius: 0
            },
            title: {
                text: ''
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            plotOptions: {
                pie: {
                    shadow: false,
                    borderColor: BACKGROUND_COLOR,
                    center: ['50%', '50%']
                }
            },
            tooltip: {
                enabled: false
            },

            exporting: {
                enabled: false
            },

            series: [
                {
                    name: 'Versions',
                    size: '90%',
                    innerSize: '60%',
                    allowPointSelect: true,
                    dataLabels: {
                        enabled: false
                    },
                    data: pieData,
                    point: {
                        events: {
                            click: function () {
								console.log(this.color);
                                var ht = (planetPosition.top) + this.series.chart.plotHeight * 0.5 - 60;
                                var lt = (planetPosition.left) + this.series.chart.plotWidth * 0.5 - 50;
                                $("#" + bubbleContainerId + "-textMain").html(this.percentage.toFixed(1) + "%")
                                    .css({position: 'absolute', left: lt - 10, top: ht});
                                $("#" + bubbleContainerId + "-textSub").html(this.name)
                                    .css({position: 'absolute', left: lt - 10, top: ht + 80})
									.css({color:this.color});
                            }
                        }
                    }

                }
            ]

        }, function(chart) {
			setTimeout(function() {
				chart.series[0].data[0].firePointEvent('click', {});
			},1000);
		});


        var bubbleChart = $('#' + bubbleContainerId).highcharts({

            chart: {
                type: 'bubble',
                spacing: [0, 0, 0, 0],
                backgroundColor: null,
                borderRadius: 0
            },
            xAxis: {
                gridLineWidth: 0,
                lineWidth: 0,
                labels: {enabled: false},
                plotLines: [
                    {color: '#54585B',
                        width: 1,
                        value: 0}
                ],
                startOnTick: false,
                tickPositions: [0]
            },
            yAxis: {
                gridLineWidth: 0,
                labels: {enabled: false},
                title: {text: null},
                minPadding: 0,
                maxPadding: 0
            },
            plotOptions: {

            },
            title: {
                text: ''
            },
            tooltip: {
                enabled: false
            },
            legend: {
                enabled: false
            },

            exporting: {
                enabled: false
            },
            series: [
                {
                    marker : {
                        fillOpacity:1
                    },
                    dataLabels: {
                        inside: true,
                        enabled: true,
                        align: "left",
						useHtml:true,
                        shadow: false,
						x:100,
						y:1,
                        formatter: function() {
							var point = this.point;
							window.setTimeout(function() {
								point.dataLabel.attr({
									x: 100
								})
							});
							return '<span style="text-align:center">'+this.point.name + '</span> <br/> <span style="text-align:center">' + this.point.z +'</span>';
						},
                        style: {
                            fontFamily: 'kievitFont',
                            fontWeight: 'bold',
                            fontSize:'1.3em',
                            color: '#C1C1C1'
                        }

                    },
                    data: bubbleData
                }
            ]

        });
    }

}

/**
 * Creates and Displays LineChart Chart.
 * Exposes method drawChart to initiate drawing from the constructor data.
 * @param lineContainerId . id of the div to render the pie
 * @param data data of shape [{key:'', value:10}]
 * @constructor
 */
function LineChart(lineChartContainerId, data,config) {

    /////CONSTANTS//////
    var BACKGROUND_COLOR="#000000";

    if (config) {
        if (config.backgroundColor) {
            BACKGROUND_COLOR = config.backgroundColor ;
        }
    }


    /////CONSTANTS//////

    if (document.getElementById(lineChartContainerId) == null) {
        console.log("Invalid lineChartContainerId Passed !!" + lineChartContainerId);
        return false;
    }

	if(config.chartWidth) {
		$('#'+lineChartContainerId).width(config.chartWidth);
	}

	if(config.chartHeight) {
		$('#'+lineChartContainerId).height(config.chartHeight);
	}

	//INTERNAL STATE
    var lineChartPosition = $("#" + lineChartContainerId).position();
    var chartData= data.splice(0);

    //Add the formatting options for labels for first and Last Point
	chartData[0].dataLabels = {
		enabled: true,
		inside: false,
		x: 15,
		style: {
			color: 'black',
			fontFamily: "standard_ctXLtCn",
			color: '#ffffff',
			fontSize: '4em'
		},
		format:'${y}'
	};
	chartData[0].marker = {
		enabled:true,
		fillColor:'#ffffff',
		radius:6
	}

    //Add the formatting options for labels for first and Last Point
    chartData[chartData.length-1].dataLabels= {
        enabled: true,
		x:-30,
		y:-15,
		verticalAlign:'middle',
        style: {
            fontFamily: "standard_ctXLtCn",
            color: '#a8a29d',
			fontSize: '4em'
        },
		format:'${y}'
    };

	chartData[chartData.length-1].marker = {
		enabled:true,
		fillColor:'#ffffff',
		radius:6
	}
    //Transform Completed

    this.drawChart = function () {
        // Create the chart
		var mychart = new Highcharts.Chart({
            chart: {
				renderTo:lineChartContainerId,
                zoomType: 'x',
                spacingRight: 20,
                backgroundColor: null
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                //type: '',
                //maxZoom: 24 * 3600000, // one day
                title: {
                    text: null
                },
                labels: {
                    enabled: true,
                    formatter: function () {
                        if (this.isLast || this.isFirst) {
                            return this.axis.series[0].xData[this.value];
                        }
                        return " ";
                    },
					style: {
						fontFamily: "standard_ctXLtCn",
						color: '#a8a29d',
						fontSize: '2em'
					}
                },
                startOnTick:true,
				lineWidth:0,
				tickWidth:0

            },
            yAxis: {
                title: {
                    text: ''
                },
                labels : {
                    enabled:false
                },
				gridLineColor: '#000000',
                startOnTick:true,
				tickColor: '#384756',
				tickLength: 10,
				tickWidth: 2,
				tickPosition: 'inside'
            },
            tooltip: {
                shared: true,
				formatter: function() {
					return '<b>' + this.y + '</b>'
				}
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: null,
                    fillOpacity: 0,
                    color:'#aeeea2',
                    marker: {
                        enabled: false
                    },
                    shadow: false,
					lineWidth: 3,
                    states: {
                        hover: {
                            lineWidth: 2
                        }
                    },
                    threshold: null
                }
            },
            exporting: {
                enabled: false
            },
            series: [
                {
                    type: 'area',
                    name: 'Total A/C Value',
					tooltip: {
						style: {
							color:'red'
						}
					},
					shadow : true,
                    data : chartData
                }
            ]
        });
    }

}
