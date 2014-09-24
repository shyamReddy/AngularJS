app.controller('stockOrderCtrl', ['$scope', '$http', '$timeout', 'brConstants',
    function ($scope, $http, $timeout, brConstants) {

        console.log('stackorder========');

        /**

                * Initialize order page

                */

        $scope.initPage = function () {

            $scope.orderModel = {};

            $scope.orderInfo = {};

            $scope.initForAccount();

        }



        /**

                * Retrieves information for the selected account

                */

        $scope.initForAccount = function () {

            if (angular.isObject($scope.accountGroups.selectedGroup)) {

                $scope.orderModel.accountId = $scope.accountGroups.selectedGroup.accountId;

            }

            $scope.orderModel.isConfirm = false;

            $scope.orderModel.isPreview = false;

            if ($scope.orderModel.accountId != "" && $scope.orderModel.accountId != null) {

                $http({

                    method: "GET",

                    url: "stockorder.do"

                }).then(function (response) {

                    var initInfo = angular.fromJson(response.data).responseObject;

                    $scope.orderInfo.authorizedMargin = initInfo.authorizedForMargin;

                    $scope.orderInfo.cashFundsMoney = initInfo.cashFundsMoney;

                    $scope.orderInfo.marginFundsMoney = initInfo.marginFundsMoney;

                });

            }

        }



        /**

                * Listen for change group event

                */

        $scope.$on('brGroupChanged', function (event) {

            $scope.initForAccount();

        });



        /**

                * Update order detail information

                */

        $scope.calculateDetails = function () {

            // Check if required fields are set

            if ($scope.orderForm.$valid && angular.isDefined($scope.orderModel.accountId)) {

                $timeout(function () {

                    // Have to wait for all fields to show and be required

                    if ($scope.orderForm.$valid) {

                        $http({

                            method: 'POST',

                            url: 'stockorder.do?fetchInfo=true&includedCalls=cFpreview',

                            data: $.param($scope.orderModel),

                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }

                        }).success(function (response) {

                            var detailInfo = angular.fromJson(response);

                            $scope.orderInfo.order = detailInfo.responseObject.order;

                        });

                    } else {

                        $scope.orderInfo.order = null;

                    }

                });

            } else {

                $scope.orderInfo.order = null;

            }

        }



        /**

                * Decide if we should show the limit and stop boxes.  Also clears the value if hidden

                * @param fieldName the name of the field being considered

                * @returns true if we should show

                */

        $scope.showPriceField = function (fieldName) {

            if (fieldName == "limitPrice") {

                if ($scope.orderModel.priceType == brConstants.VoltsConstants_OpenOrder_PRICETYPE_LIMIT

                    || $scope.orderModel.priceType == brConstants.VoltsConstants_OpenOrder_PRICETYPE_STOPLIMIT) {

                    return true;

                } else {

                    $scope.orderModel[fieldName] = "";

                    return false;

                }

            } else if (fieldName == "stopPrice") {

                if ($scope.orderModel.priceType == brConstants.VoltsConstants_OpenOrder_PRICETYPE_STOP

                    || $scope.orderModel.priceType == brConstants.VoltsConstants_OpenOrder_PRICETYPE_STOPLIMIT) {

                    return true;

                } else {

                    $scope.orderModel[fieldName] = "";

                    return false;

                }



            }

        }



        /**

                * Submit order form info to preview action

                */

        $scope.previewOrder = function () { 
		

            $scope.orderModel['previewOrder.x'] = "1";

            $http({

                method: 'POST',

                url: 'stockorder.do',

                data: $.param($scope.orderModel),

                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }

            }).success(function (response) {

                var previewInfo = angular.fromJson(response);

                if (previewInfo.status == "error") {

                    // store error information and stay on edit

                    $scope.orderInfo.errors = previewInfo.responseObject;
                    $scope.orderInfo.errors.quantity = null;

                } else {

                    // show preview screen

                    $scope.orderInfo.errors = {};

                    $scope.orderModel.isPreview = true;

                    $scope.orderInfo.order = previewInfo.responseObject.order;

                }

            });

            delete $scope.orderModel['previewOrder.x'];

        };



        /**

                * Go from preview back to edit page

                */

        $scope.editOrder = function () {

            $scope.orderModel.tradingPassword = "";

            $scope.orderModel.isPreview = false;

        };



        /**

                * Submit order for final processing

                */

        $scope.placeOrder = function () {

            $scope.orderModel['submitOrder.x'] = "1";

            $http({

                method: 'POST',

                url: 'stockorder.do',

                data: $.param($scope.orderModel),

                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }

            }).success(function (response) {

                var confirmInfo = angular.fromJson(response);

                if (confirmInfo.status == "error") {

                    // store error information and send to edit

                    $scope.orderInfo.errors = confirmInfo.responseObject;

                    $scope.orderModel.tradingPassword = "";

                    $scope.orderModel.isPreview = false;

                } else {

                    $scope.orderModel.isConfirm = true;

                    $scope.orderModel.isPreview = false;

                    $scope.orderInfo.order = confirmInfo.responseObject.order;

                }

            });

            delete $scope.orderModel['submitOrder.x'];

        };



        /**

                * Retrieve quote information for symbol entered.

                * @param symbolType the symbol type of the order

                */

        $scope.symbolChanged = function (symbolType) {

            if ($scope.orderModel.symbol == null) {

                $scope.orderInfo.quote = null;

                return;

            }

            $http({

                method: 'GET',

                url: 'stockorder.do?fetchInfo=true&includedCalls=cFquote&symbol=' + $scope.orderModel.symbol + '&type=' + symbolType

            }).success(function (response) {

                var quoteInfo = angular.fromJson(response);

                if (quoteInfo.status == "success"

                    && angular.isObject(quoteInfo.responseObject.quote)) {

                    // store error information

                    $scope.orderInfo.quote = quoteInfo.responseObject.quote;



                } else {

                    // Quote error

                    $scope.orderInfo.quote = null;

                    return;

                }

            });

            $scope.calculateDetails();

        };



        /**

                * Check if a particular property has an error returned from json response.

                * @param propertyName the property name to check

                * @returns true if there is an error

                */

        $scope.hasError = function (propertyName) {

            if (angular.isObject($scope.orderInfo.errors)) {

                    angular.isObject($scope.orderInfo.errors[propertyName]);

            }

            return false;

        };



        // initialize page

        $scope.initPage();

    }
]);



//# sourceURL=stockorder.js


