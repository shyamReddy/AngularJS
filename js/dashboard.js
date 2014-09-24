app.factory('Dashboard', ['$http', '$q', function ($http, $q) {

	var DASHBOARD_URL = "dashboard.do?includedCalls=";
	var targetUrl = "";
	return {
		setCalls: function (calls) {
			targetUrl = DASHBOARD_URL + calls;
		},
		get: function () {
			var delay = $q.defer();
			$http({
				method: "GET",
				url: 'js/json/dashboard.json'
			}).then(function (response) {
				delay.resolve(angular.fromJson(response.data));
			});
			return delay.promise;
		}
	}
}
]);
app.controller('dashboardCtrl', ['Dashboard','$scope', function (Dashboard,$scope) {

	//Public Functions
	$scope.updateLineData = function(data) {
		if (data) {
			$scope.lineData = data;
		}
	}
	$scope.updatePieData = function(data) {
		if (data) {
			$scope.pieData = data;
		}
	}
	$scope.updateMarketData = function(marketData) {
		if (marketData) {
			$scope.marketData = marketData;
			$scope.selectMarketIndex(0);
		}
	}
	$scope.updateBalances = function(balances) {
		if (balances) {
			$scope.balances = balances;
		}
	}

	$scope.canGenerateView = function(viewId) {
		return ($scope.currentView == viewId) && ($scope.loadedView[viewId] === undefined)
	};
		$scope.lineseclection =true;
		$scope.pieseclection =true;
		$scope.listseclection = true;
	$scope.showView = function(viewId){
		$scope.currentView=viewId;
		$scope.leftfull='';
		if(viewId == 'line')
		{
		$scope.lineseclection = false;
		$scope.pieseclection =true;
		$scope.listseclection = true;
		}
		else if(viewId == 'pie')
		{
		$scope.pieseclection = false;
		$scope.lineseclection =true;
		$scope.listseclection = true;
		}
		else
		{
		$scope.lineseclection =true;
		$scope.pieseclection =true;
		$scope.listseclection = false;
		}
	}

	$scope.viewLoaded=  function(viewId){
		$scope.loadedView[viewId]=true;
	}


	$scope.selectMarketIndex = function(index) {
		$scope.currentMarketIndex = index;
	}

	$scope.selected = function(viewId) {
		if ($scope.currentView == viewId) {
			return "Selected";
		}
		return "";
	}

	$scope.toggleHeight = function(container) {
		if ($scope[container+'full'] == 'full') {
			$scope[container+'full']='';
		} else {
			$scope[container+'full']='full';
		}

	}
	//Initialize
	$scope.currentView = '';
	$scope.loadedView = {};

	var loadDashBoard = function(calls) {
		if (calls == "") {
			calls = "balances,marketData,lineData,pieData,toppers,snapshot";
		}
		Dashboard.setCalls(calls);
		Dashboard.get($scope.accountId).then(function (response) {
			data = response.responseObject;
			if (data.snapshot) {
				$scope.snapshot=data.snapshot;
			}
			if (data.toppers) {
				$scope.toppers = data.toppers;
			}
			if (data.totalValue) {
				$scope.totalValue = data.totalValue;
			}
			$scope.updateLineData(data.lineData);
			$scope.updatePieData(data.pieData);
			$scope.updateMarketData(data.marketData);
			$scope.updateBalances(data.balances);


			$scope.currentView='pie';

		});
	}


	$scope.$on('brGroupChanged',function() {
		loadDashBoard("balances,lineData,pieData,toppers,snapshot");
	});


	loadDashBoard("");

}]);


app.directive('brLineChart', ['$http',function ($http) {
	function linkfn(scope, element, attrs) {
		scope.$watch(attrs.generate, function (newValue, oldValue) {
			if (newValue) {
				var lineData = scope.lineData;
				var x = new LineChart(element.parent().get(0).id, lineData, {backgroundColor: '#262729', chartWidth: angular.element(".topLeftWrapper").first().width(), chartHeight: angular.element(".topLeftWrapper").first().height()});
				x.drawChart();

				//call any callbacks on the current scope
				if (attrs.onLoad) {
					scope.$eval(attrs.onLoad);
				}
			}

		});
	}

	return {
		restrict: 'E',
		link: linkfn
	};
}]);

app.directive('brBubbleChart', ["$http","$timeout", function ($http,$timeout) {
	function linkfn(scope, element, attrs) {
		scope.$watch(attrs.generate, function (newValue, oldValue) {
			if (newValue) {
				$timeout(function() {
					var pieData = scope.pieData;
					var x = new PieAndPlanet(element.parent().get(0).id, pieData, {backgroundColor: '#262729',chartWidth:angular.element(".topLeftWrapper").first().width(), chartHeight: angular.element(".topLeftWrapper").first().height()});
					x.drawChart();
				});

				if (attrs.onLoad) {
					scope.$eval(attrs.onLoad);
				}

			}

		});
	}

	return {
		restrict: 'E',
		link: linkfn
	};
}]);


//# sourceURL=dashboard.js
