
app.controller('rootCtrl', ['$scope', '$http', function ($scope, $http) {

	$scope.isDefined = function(x) {
		return angular.isDefined(x);
	};

	$scope.showAccounts = false;
	$scope.accounts = {
		'showSelector': false,
		'accountList': [],
		'selectedAccount': null
	};
	$scope.selectAccount = function(accountId) {

		angular.forEach($scope.accounts.accountList, function(account, key) {
			if (account.number == accountId) {
				$scope.accounts.selectedAccount = account;
				$scope.accounts.showSelector = false;
				return;
			}
		});
	};

	$scope.navigation = {
		'sideOpen': false,
		'selectedPage': null,
		'contents': []
	};
	$http({
		method: "GET",
		url: "js/json/navigation.json"
	}).then(function(response) {
		var nav =  angular.fromJson(response.data);
		angular.forEach(nav, function(category, catKey) {
			angular.forEach(category.subNav, function(navItem, navKey) {
				navItem.parent = category;
			});
		});
		$scope.navigation.contents = nav
	});
	$http({
		method: "GET",
		url: "js/json/accounts.json"
	}).then(function(response) {
		$scope.accounts.accountList =  angular.fromJson(response.data);
		$scope.accounts.selectedAccount = $scope.accounts.accountList[0];
       // $scope.orderForm={accountId : '85421219'};

	});
	$http({
		method: "GET",
		url: "js/json/favorites.json"
	}).then(function(response) {
		$scope.favoriteList =  angular.fromJson(response.data);
	});

	$scope.pageTitle = 'Admin';
	$scope.$on("$routeChangeSuccess", function (event, current, previous) {
		$scope.pageTitle = current.title;

		// find current page in navigation
		angular.forEach($scope.navigation.contents, function(category, catKey) {
			angular.forEach(category.subNav, function(navItem, navKey) {
				if (navItem.url == current.originalPath) {
					$scope.navigation.selectedPage = navItem;
					return;
				}
			});
		});
	});

}]);

app.controller('positionsCtrl', ['$scope', '$http', 'ngTableParams', function ($scope, $http, ngTableParams) {
	var positionData = [{symbol: "AVA", description: "Avista Corp", quantity: "986", price: "25.34", marketValue: "24,985.24", symbolType: 'Common Stock'},
						{symbol: "BR", description: "Broadridge Financial", quantity: "115", price: "25.34", marketValue: "2,914.10", symbolType: 'Common Stock'},
						{symbol: "T", description: "At&t", quantity: "353", price: "25.34", marketValue: "8,945.02", symbolType: 'Common Stock'},
						{symbol: "GOOG", description: "Google", quantity: "433", price: "25.34", marketValue: "1,000.25", symbolType: 'Common Stock'},
						{symbol: "MSFT", description: "Microsoft", quantity: "11", price: "25.34", marketValue: "1,000.25", symbolType: 'Common Stock'},
						{symbol: "YHOO", description: "Yahoo", quantity: "353", price: "25.34", marketValue: "1,000.25", symbolType: 'Common Stock'},
						{symbol: "ADP", description: "Automated Data Processing", quantity: "5,000", price: "25.34", marketValue: "1,000.25", symbolType: 'Common Stock'},
						{symbol: "NFLX", description: "Netflix", quantity: "353", price: "25.34", marketValue: "1,000.25", symbolType: 'Common Stock'},
						{symbol: "GOOG", description: "Google", quantity: "433", price: "25.34", marketValue: "1,000.25", symbolType: 'Common Stock'},
						{symbol: "MSFT", description: "Microsoft", quantity: "11", price: "25.34", marketValue: "1,000.25", symbolType: 'Common Stock'},
						{symbol: "YHOO", description: "Yahoo", quantity: "353", price: "25.34", marketValue: "1,000.25", symbolType: 'Common Stock'},
						{symbol: "ADP", description: "Automated Data Processing", quantity: "5,000", price: "25.34", marketValue: "1,000.25", symbolType: 'Common Stock'},
						{symbol: "NFLX", description: "Netflix", quantity: "353", price: "25.34", marketValue: "1,000.25", symbolType: 'Common Stock'},
						{symbol: "404303030", description: "HSBC Bank USA NA 4.300%", quantity: "25,000", price: "1.34", marketValue: "33,500.00", symbolType: 'Certificates of Deposit'},
						{symbol: "454578337", description: "CITI NA 2.600%", quantity: "15,000", price: "1.34", marketValue: "20,100.00", symbolType: 'Certificates of Deposit'},
						{symbol: "977676334", description: "HSBC Bank USA NA 5.300%", quantity: "5,000", price: "1.34", marketValue: "6,700.00", symbolType: 'Certificates of Deposit'}
	];
	$scope.tableParams = new ngTableParams({
		page: 1,
		count: 100
	}, {
		groupBy: 'symbolType',
		counts: [],
		total: 1,
		getData: function($defer, params) {
			var orderedData = positionData;
			$defer.resolve(positionData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
		}
	});
//	$scope.getAggregateInfo = function(theRow) {
//		// TODO get this info from the json instead of calculating?
//		var totalMarketValue = 0;
//		angular.forEach(theRow.children, function(child, key) {
//			console.log(child.entity.marketValue);
//			totalMarketValue += parseFloat(child.entity.marketValue.replace(/,/g, ''));
//		});
//		return totalMarketValue;
//	};
}]);
app.controller('stockOrderCtrl', ['$scope', '$http', function ($scope, $http) {
   /* $scope.$watch($scope.orderForm.accountId,function(val)
    {
        console.log(val,"val");
    });*/
}]);
app.controller('watchlistCtrl', ['$scope', '$http', function ($scope, $http) {
}]);
