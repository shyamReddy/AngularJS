/*
*
* Created by Jeewan Aryal on 5/30/2014.
app.controller('balancesController', ['$scope', '$http', function($scope,$http){
                console.log("balances");
}]);
*/
app.directive('highchart', function () {
    return {
        restrict: 'E',
        template: '<div> </div>',
        replace: true,
        link: function (scope, element, attrs) {
            scope.$watch(function () {
                return attrs.chart;
            },

            function () {
                if (!attrs.chart)
                return;

                var charts = JSON.parse(attrs.chart);
				//attrs.chart.renderer.image('http://placehold.it/50x20',350,360,50,20).add();
                $(element[0]).highcharts(charts);
            });
        }
    };
});

app.controller('balancesCtrl', ['$scope', '$http','$window',
    function ($scope, $http, $window) {
        var loadData = function () {
            $http({
                method: "GET",
                url: "js/json/balances.json"
            }).then(function (response) {
                var balanceInfo = angular.fromJson(response.data).responseObject;
                $scope.balances = balanceInfo;

                //$scope.renderChart = {
				angular.element('.chartInnerdiv').highcharts({
				
                    tooltip: {
                        enabled: false
                    },
                    chart: {
                        type: 'column',
                        backgroundColor: '',
                        marginTop: 50,
                        marginBottom: 20,
                        events: {
                            load: function () {
                                dataLabelsUpdate(this)
                            },
                            redraw: function () {
                                dataLabelsUpdate(this)
                            }
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    title: {
                        text: null
                    },
                    xAxis: {
                        type: 'linear',
                        labels: {
                            enabled: false
                        },
                        lineWidth: 0,
                        minorGridLineWidth: 0,
                        lineColor: 'null',
                        minorTickLength: 0,
                        tickLength: 0
                    },
                    credits: {
                        enabled: false
                    },
                    yAxis: {
                        max: null,
                        gridLineColor: 'null',
                        labels: {
                            enabled: false
                        },
                        title: {
                            text: ""
                        },
                        plotLines: [{
                            color: "#b1bdc1",
                            width: 3,
                            value: 0
                        }],
                        plotOptions: {
                            column: {
							dataLabels: {
                    enabled: true
                },
                                pointPadding: 0,
                                borderWidth: 3
                            }
                        }
                    },
                    series: [{
                        data: [{
                            y: balanceInfo.cashPrincipalAmount,
							
                            dataLabels: {
                                enabled: true,
                                format: '<span>Cash Available</span><br />' + balanceInfo.cashPrincipalAmount,
                                useHTML: true,
                                crop: false,
                                overflow: 'none',

                                style: {
                                    'color': '#bcbdbd',
                                    'fontFamily': 'standardCondensed',
                                    'margin': '0',
                                    'textAlign': 'center',
                                    'fontSize': '2em'
                                }
                            }
                        }, {
                            y: balanceInfo.netMarketValue,
                            dataLabels: {
                                enabled: true,
                                format: '<span>Market Value</span><br />' + balanceInfo.netMarketValueMoney,
                                useHTML: true,
                                crop: false,
                                overflow: 'none',
                                style: {
                                    'color': '#bcbdbd',
                                    'fontFamily': 'standardCondensed',
                                    'marginLeft': '0',
                                    'textAlign': 'center',
                                    'fontSize': '2em'
                                }
                            }
                        }, {
                            y: balanceInfo.equity,
                            dataLabels: {
                                enabled: true,
                                format: '<span>Total Account Value</span><br />' + balanceInfo.equityMoney,
                                useHTML: true,
                                crop: false,
                                overflow: 'none',
                                style: {
                                    'color': '#bcbdbd',
                                    'fontFamily': 'standardCondensed',
                                    'margin': '0',
                                    'textAlign': 'center',
                                    'fontSize': '2em'
                                }
                            }
                        }],

                        color: '#a5e59c',
                        negativeColor: '#fa564f',
                        pointWidth: 140,
                        name: 'null',
                        borderColor: 'transparent'
                    }]					
				
				});
				function dataLabelsUpdate(chart) {        
             var max = 0;
   
         angular.forEach(chart.series, function(serie,i ) {
        angular.forEach(serie.data, function(j,d) {
        if(max > j.dataLabel.y || j == 0)
                    max = j.dataLabel.y;           
             
     });                  
     });
        angular.forEach(chart.series, function(serie,i ) {
        angular.forEach(serie.data, function(j,d) {
                
                j.dataLabel.attr({
                    y: max
                });
            });
        });
    }
				

            });
        };
        // initial load
        loadData();
        // listen for group change or refresh
        $scope.$on('brGroupChanged', function (event) {
            $scope.balances = null;
            loadData();
        });
        $scope.$on('brPageRefresh', loadData);


        console.log("window",angular.element($window));

        angular.element($window).bind('orientationchange', function () {

            loadData();
        });
    }

]);


//# sourceURL=balances.js
/*
app.controller('balancesCtrl', ['$scope', '$http', function ($scope, $http) {
    var loadData = function () {
        $http({
            method: "GET",
            url: "js/json/balances.json"

        }).then(function (response) {
            var balanceInfo = angular.fromJson(response.data).responseObject;
            $scope.balances = balanceInfo;
            var balances = [];
            balances.push(balanceInfo.cashPrincipalAmount, balanceInfo.marketValue, balanceInfo.totalMoney);
			var titleHTML = "<span>Cash available</span><span>Market Value</span><span>Total Value</span></br>" ;
			//titleHTML += "<span>$" + balanceInfo.cashPrincipalAmount*-1 + "</span><span>$" + balanceInfo.marketValue + "</span><span>$" + balanceInfo.totalMoney + "</span>";*/

           /* $scope.renderChart = {
                tooltip: {
                    enabled: false
                },
                chart: {
                    type: 'column',
					backgroundColor:'#4f6270',
					height:'280'
                },
                subtitle : {
                    text:titleHTML,
                    useHTML : true,
                    align : "left",

                },
                title: {
                    text: null
                },
                xAxis: {
                    type: 'linear',
                    labels: {
                        enabled: false
                    },
                    lineWidth: 0,
                    minorGridLineWidth: 0,
                    lineColor: 'transparent',
                    minorTickLength: 0,
                    tickLength: 0
                },
                credits: {
                    enabled: false,
                },
                yAxis: {
                    max: null,
                    labels: {
                        enabled:false
                    },
                    title: {
                        text: ""
                    },
					plotLines: [{
                    color: '#fff',
                    width: 2,
                    value: 0
            }],
                    plotOptions: {
                        column: {
                            pointPadding: 0,
                            borderWidth: 3
                        },
                        bar: {
                            allowPointSelect: true,
                            cursor: 'pointer'
                        }
                    }
                },
                plotOptions: {

                    series: {

                        dataLabels: {
                            enabled: true,
                            color: '#fff',
							y:'0',
                        }
                    }
                },
                series: [{
                  data: balances,
                    color: '#61bf67',
                    negativeColor: '#FF0000',
                    pointWidth: 140,
                    borderColor: '#000'
                }]

            };

        });
    };
    // initial load
    loadData();

    // listen for group change or refresh
    $scope.$on('brGroupChanged', function (event) {

        $scope.balances = null;
        loadData();
    });

    $scope.$on('brPageRefresh', loadData);
}]); */
//# sourceURL=balances.js
