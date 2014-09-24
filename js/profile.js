/**
 * Created by mboulatian on 5/16/2014.
 */
app.controller('profileCtrl', ['$scope', '$http', function ($scope, $http) {
    var loadData = function () {
        $http({
            method: "GET",
            url: "js/json/profile.json"
        }).then(function (response) {
            var profileInfo = angular.fromJson(response.data).responseObject;
            $scope.profile = profileInfo.profileQueryModel;
            $scope.profile.curYrCommission = $scope.profile.curYrCommission || 1;
            $scope.profile.prevYrCommission = $scope.profile.prevYrCommission || 1;
            $scope.profile.curYrCreditInterest = $scope.profile.curYrCreditInterest || 1;
            $scope.profile.prevYrCreditInterest = $scope.profile.prevYrCreditInterest || 1;
            $scope.profile.curYrBondInterestTaxable = $scope.profile.curYrBondInterestTaxable || 1;
            $scope.profile.prevYrBondInterestTaxable = $scope.profile.prevYrBondInterestTaxable || 1;
            $scope.profile.curYrBondInterestNonTaxable = $scope.profile.curYrBondInterestNonTaxable || 1;
            $scope.profile.prevYrBondInterestNonTaxable = $scope.profile.prevYrBondInterestNonTaxable || 1;
            $scope.profile.curYrDividends = $scope.profile.curYrDividends || 1;
            $scope.profile.prevYrDividends = $scope.profile.prevYrDividends || 1;
            $scope.profile.curYrMarginInterest = $scope.profile.curYrMarginInterest || 1;
            $scope.profile.prevYrMarginInterest = $scope.profile.prevYrMarginInterest || 1;
            $scope.profile.curYrTrades = $scope.profile.curYrTrades || 1;
            $scope.profile.prevYrTrades = $scope.profile.prevYrTrades || 1;
        });

        $scope.group1 = {
            open: true
        };
    }
    // initial load
    loadData();
    // listen for group change or refresh
    $scope.$on('brGroupChanged', function (event) {
        $scope.profile = null;
        loadData();
    });
    $scope.$on('brPageRefresh', loadData);
}]);

app.directive('barPair', ['$document', '$timeout', '$parse', function ($document, $timeout, $parse) {
    return {
        restrict: 'E',
        scope: {
            current: '=',
            prior: '=',
            currentFmt: '=',
            priorFmt: '=',
            maxHeight: '='
        },
        link: function (scope, element, attrs) {
            scope.$watchCollection('[current,prior,maxHeight]', function (newValue, oldValue) {
                if (angular.isDefined(newValue[0]) && angular.isDefined(newValue[1]) && angular.isDefined(newValue[2])) {
                    scope.headingLabel = attrs.headingLabel;

                    var current = newValue[0];
                    var prior = newValue[1];
                    var maxHeight = newValue[2];

                    scope.firstUnits = "em";
                    scope.secondUnits = "em";
                    if (current == 1) {
                        scope.firstUnits = "px";
                        scope.firstHeight = 1;
                        scope.firstMarginTop = maxHeight - 1 / maxHeight;
                    } else {
                        if (current > prior) {
                            scope.firstHeight = maxHeight;
                            scope.firstMarginTop = 0;
                        } else {
                            scope.firstHeight = maxHeight * current / prior;
                            scope.firstMarginTop = maxHeight - scope.firstHeight;
                        }
                    }
                    if (prior == 1) {
                        scope.secondUnits = "px";
                        scope.secondHeight = 1;
                        scope.secondMarginTop = maxHeight - 1 / maxHeight;
                    } else {
                        if (prior > current) {
                            scope.secondHeight = maxHeight;
                            scope.secondMarginTop = 0;
                        } else {
                            scope.secondHeight = maxHeight * prior / current;
                            scope.secondMarginTop = maxHeight - scope.secondHeight;
                        }
                    }

                    scope.currentYear = new Date().getFullYear();
                    scope.pastYear = scope.currentYear - 1;
                }
            });
        },
        template: '<span class="chartHeading">{{headingLabel}}</span><br><br>'
            + '<div class="rectangle" style="margin-top:{{firstMarginTop}}em;">'
            + '<div class="chartLabelTop">{{currentFmt}}</div>'
            + '<div class="chartBackgroundCurrent" style="height:{{firstHeight}}{{firstUnits}};"><div class="chartLabel chartLabelInside">{{currentFmt}}</div></div>'
            + '<div class="year">{{currentYear}} YTD</div>'
            + '</div>'
            + '<div class="rectangle" style="margin-top: {{secondMarginTop}}em;">'
            + '<div class="chartLabelTop">{{priorFmt}}</div>'
            + '<div class="chartBackgroundPrior" style="height:{{secondHeight}}{{secondUnits}};"><div class="chartLabel chartLabelInside">{{priorFmt}}</div></div>'
            + '<div class="year">{{pastYear}}</div>'
            + '</div>'
    }
}]);

//# sourceURL=profile.js
