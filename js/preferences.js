app.controller('preferencesController', ['$scope', '$http', '$timeout', '$rootScope', '$sce',
    function ($scope, $http, $timeout, $rootScope, $sce) {



        $scope.successMessage = true;



        $scope.settingLists = [{

            settingIcon: "&#128100;",

            settingText: "Change User ID",

            templateUrl: "templates/pref-changeuserid.html"

        }, {

            settingIcon: "&#128273;",

            settingText: "Change Login Password",

            templateUrl: "templates/pref-changepassword.html"

        }, {

            settingIcon: "&#128273;",

            settingText: "Change Trading Password",

            templateUrl: "templates/pref-chgtradepswd.html"

        }, {

            settingIcon: "&#59170;",

            settingText: "Select Account",

            templateUrl: "templates/pref-defaultaccount.html"

        }, {

            settingIcon: "&#9993;",

            settingText: "Change Email Address",

            templateUrl: "templates/pref-changeemail.html"

        }, {

            settingIcon: "&#57349;",

            settingText: "Change Line Number",

            templateUrl: "templates/pref-linesperpage.html"

        }, {

            settingIcon: "&#10133;",

            settingText: "Add Hotkeys",

            templateUrl: "templates/pref-userBookmark.html"

        }, {

            settingIcon: "&#128101;",

            settingText: "Account Groups",

            templateUrl: "templates/pref-accountgroup.html"

        }];



        var iconArray = new Array();

        angular.forEach($scope.settingLists, function (v, k) {

            iconArray.push($sce.trustAsHtml($scope.settingLists[k].settingIcon));

        });

        $scope.dummy = "&quot;this is dummy &quot;";
        console.log($scope.dummy);
        console.log($sce.trustAsHtml($scope.dummy));

        $scope.icons = iconArray;

        $scope.defaultShow = true;

        $scope.labelText = $scope.settingLists[0].settingText;

        $scope.includeUrl = $scope.settingLists[0].templateUrl;

        $scope.selectedIndex = 0;

        $scope.selectedIndexIcon = 0;

        $scope.openSettingInput = function ($index) {

            $scope.defaultShow = false;

            $scope.$index = $index;

            $scope.selectedIndex = $index;

            $scope.selectedIndexIcon = $index;

            $scope.labelText = $scope.settingLists[$index].settingText;

            $scope.includeUrl = $scope.settingLists[$index].templateUrl;

        }



        $rootScope.displaySuccess = function () {

            $scope.successMessage = false;

            $timeout(function () {

                $scope.successMessage = true;

            }, 1000);

        };

    }

]);



app.controller('changeUserIdController', ['$scope', '$http', '$timeout', '$rootScope', '$sce',
    function ($scope, $http, $rootScope, $timeout, $sce) {

        $scope.userIdInfo ={};

        $scope.changeUserId = function () {

            var backlen = history.length;
            alert('go'+backlen);
            history.go(-backlen);
            $http({

                method: 'GET',

                //url: 'useridpasswordsettings.do',
                url:'js/json/myjson.json',


                data: $.param($scope.user),

                headers: {

                    'Content-Type': 'application/x-www-form-urlencoded'

                }

            }).success(function (response) {

                var detailInfo = angular.fromJson(response);
                if (detailInfo.status == 'error') {
                    $scope.submitted = true;
                    $scope.userIdInfo.errors = detailInfo.responseObject;
                    $scope.userIdInfo.errors.quantity = null;
                }

                if (detailInfo.status == 'success') {
				console.log('we are in success');

                    $rootScope.displaySuccess();

                }

            });

        };

        $scope.reset = function () {

            $scope.user = {};
            $scope.userIdInfo = {};
            $scope.submitted = false;

        };

        $scope.hasError = function (propertyName) {

            if (angular.isObject($scope.userIdInfo.errors)) {

                angular.isObject($scope.userIdInfo.errors[propertyName]);

            }

            return false;

        };

    }

]);



app.controller('changePasswordController', ['$scope', '$http', '$timeout', '$rootScope', '$sce',
    function ($scope, $http, $rootScope, $timeout, $sce) {

        $scope.loginPwdInfo = {}

        $scope.changeLoginPassword = function () {

            $http({

                method: 'POST',

               // url: 'useridpasswordsettings.do',
                url: 'js/json/myjson.json',

                data: $.param($scope.login),

                headers: {

                    'Content-Type': 'application/x-www-form-urlencoded'

                }

            }).success(function (response) {

                var detailInfo = angular.fromJson(response);



                if (detailInfo.status == 'error') {

                    $scope.submitted = true;


                    $scope.loginPwdInfo.errors = detailInfo.responseObject;

                }

                if (detailInfo.status == 'success') {

                    $rootScope.displaySuccess();

                }

            });

        };

        $scope.passwordReset = function () {

            $scope.login = {};

            $scope.submitted = false;

        };
        $scope.hasError = function(propertyName) {
           	if (angular.isObject($scope.loginPwdInfo.errors)) {
               		return angular.isObject($scope.loginPwdInfo.errors[propertyName]);
               		}
            	return false;
            	};

    }

]);



app.controller('chgTradePswdController', ['$scope', '$http', '$timeout', '$rootScope', '$sce',
    function ($scope, $http, $rootScope, $timeout, $sce) {



        $scope.changeTradingPassword = function () {

            $http({

                method: 'POST',

                url: 'useridpasswordsettings.do',

                data: $.param($scope.trading),

                headers: {

                    'Content-Type': 'application/x-www-form-urlencoded'

                }

            }).success(function (response) {

                var detailInfo = angular.fromJson(response);



                if (detailInfo.status == 'error') {

                    $scope.submitted = true;

                    $scope.tradingPwdInfo.errors = detailInfo.responseObject;

                }

                if (detailInfo.status == 'success') {

                    $rootScope.displaySuccess();

                }

            });

        };

        $scope.tradingReset = function () {

            $scope.trading = {};

            $scope.submitted = false;

        }

    }

]);



app.controller('defaultAccountController', ['$scope', '$http', '$timeout', '$rootScope', '$sce',
    function ($scope, $http, $timeout, $rootScope, $sce) {


        $scope.token ='';
        $http({

            method: "GET",

            url: "js/json/accounts.json"

        }).then(function (response) {

            $scope.accountsData = angular.fromJson(response.data);
            
			$scope.selectAcct = $scope.accountsData[0];


        });
		
        $http({


            method: 'GET',

            url: 'js/json/token.json'

        }).success(function(response) {

            var detailInfo = angular.fromJson(response);

            console.log(detailInfo);
            $scope.token = detailInfo.transactionToken;
           $scope.selectacc = 85421219;
        });


        $scope.selectAccount = function () {		
            
            $scope.acc = {};
            $scope.acc['org.apache.struts.taglib.html.TOKEN'] = $scope.token;
            $scope.acc['selectAcct'] = $scope.selectAcct.number;
            //$scope.accArray.push($scope.acc);
            console.log($.param($scope.acc));
            $http({

                method: 'POST',

                url: 'useridpasswordsettings.do',

                data:$.param($scope.acc),

                headers: {

                    'Content-Type': 'application/x-www-form-urlencoded'

                }

            }).success(function (response) {

                var detailInfo = angular.fromJson(response);



                if (detailInfo.status == 'error') {

                    $scope.submitted = true;

                    $scope.accountInfo.errors = detailInfo.responseObject;

                }

                if (detailInfo.status == 'success') {

                    $rootScope.displaySuccess();

                }

            });

        };

        $scope.cancelAccount = function(){

            $scope.selectAcct = '';
        };

    }

]);



app.controller('changeEmailController', ['$scope', '$http', '$timeout', '$rootScope', '$sce',
    function ($scope, $http, $rootScope, $timeout, $sce) {


        $scope.changeEmail = function () {
		console.log($scope.user.email);
		console.log($scope.user);

            $http({

                method: 'POST',

                url: 'userdefaultsettings.do',

                data: $.param($scope.user),

                headers: {

                    'Content-Type': 'application/x-www-form-urlencoded'

                }

            }).success(function (response) {

                var detailInfo = angular.fromJson(response);



                if (detailInfo.status == 'error') {

                    $scope.submitted = true;

                    $scope.emailInfo.errors = detailInfo.responseObject;

                }

                if (detailInfo.status == 'success') {

                    $rootScope.displaySuccess();

                }

            });

        };

        $scope.emailReset = function () {

            $scope.user = {};

            $scope.submitted = false;

        }

    }

]);



app.controller('linesPerPageController', ['$scope', '$http', '$timeout', '$rootScope', '$sce',
    function ($scope, $http, $rootScope, $timeout, $sc) {


        $http({


            method: 'GET',

            url: 'js/json/package.json'

        }).success(function(response) {

            var detailInfo = angular.fromJson(response);

            console.log(detailInfo.responseObject.order.accountId);
            console.log(detailInfo.responseObject.accounts[detailInfo.responseObject.order.accountId]);


        });

        $scope.myfocus = function(){
            $scope.errorShow = false;
        };


        $scope.isNumberKey = function(evt)
        {
            console.log(evt);
            var charCode = (evt.which) ? evt.which : event.keyCode
            if (charCode > 31 && (charCode < 48 || charCode > 57))
            {
                console.log(angular.element('#lineNum'));

                return false;
            }
            return true;
        };

        $scope.validLineNumber = function () {
           // console.log(angular.element('#lineNum')[0].value);
            $scope.errorShow = true;

            $http({

                method: 'POST',

                url: 'userdefaultsettings.do',

                data: $.param($scope.number),

                headers: {

                    'Content-Type': 'application/x-www-form-urlencoded'

                }

            }).success(function (response) {

                var detailInfo = angular.fromJson(response);



                if (detailInfo.status == 'error') {

                    $scope.submitted = true;

                    $scope.lineNumInfo.errors = detailInfo.responseObject;

                }

                if (detailInfo.status == 'success') {

                    $rootScope.displaySuccess();

                }

            });

        };

        $scope.numberReset = function () {
		
           $scope.number = {};
            $scope.submitted = false;

        }

    } 

]);
app.directive('productionQty', function(){
    return {
        restrict: 'A',
        link: function(scope, elem, attr, ctrl) {
            elem.bind('keypress', function(evt){
                var charCode = (evt.which) ? evt.which : event.keyCode
                if (charCode > 31 && (charCode < 48 || charCode > 57))
                {
                    console.log(angular.element('#lineNum').val());
                    scope.$apply(function(){
                        scope.$eval(attr.productionQty); // passed to this function
                    });

                }
                else
                {
                    alert('else');
                }

            });
        } };
});



app.controller('userBookmarkController', ['$scope', '$http', '$timeout', '$rootScope', '$sce',
    function ($scope, $http, $rootScope, $timeout, $sc) {

      
$scope.availableKeys =[];
$http({

             method: "GET",

             url: "js/json/navigation.json"

         }).then(function (response) {

           navData = angular.fromJson(response.data);
			
			 angular.forEach(navData, function(category, catKey) {
			angular.forEach(category.subNav, function(navItem, navKey) {
				
				$scope.availableKeys.push(navItem.label);
				
			});
			
			
		});
			//$scope.availableKeys1 = $scope.availableKeys;
            console.log($scope.availableKeys);

         });
		
		
	
			
			
         $scope.addedHotKeys = [];
		$scope.currinx = '';
			
         $scope.addHotKeys = function ($index) {
		 $scope.currinx = $index;
				
             if ($scope.addedHotKeys.length < 5) {

                 $scope.error = false;

                 $scope.addedHotKeys.push($scope.availableKeys[$index]);

                 $scope.availableKeys.splice($index, 1);

             } else {

                 $scope.error = true;

             }

         };
         $scope.removeHotKeys = function ($index) {

             $scope.error = false;

             //$scope.availableKeys.push($scope.addedHotKeys[$index]); 
			 $scope.availableKeys.splice($scope.currinx,0,$scope.addedHotKeys[$index]);			 
             $scope.addedHotKeys.splice($index, 1);

         };
		 
		 $scope.hotKeys = function()
		 {
			console.log($scope.addedHotKeys);
             var jsonObj =[];
             for(var i=0;i<$scope.addedHotKeys.length;i++)
             {
                 var obj = {};
                 obj['hotkey'] = $scope.addedHotKeys[i];
                 jsonObj.push(obj);
             }
             console.log(jsonObj);
			$http({

                            method: 'POST',

                            url: '/demobps/useridpasswordsettings.do;jsessionid=6B5DC3A3701CE41534EC0E0E3DD7D065',

                            data:$scope.jsonObj,

                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }

                        }).success(function (response) {

                            var detailInfo = angular.fromJson(response);

                          if(detailInfo.status == "error")
						  {
						  $scope.hotKeyInfo.errors = detailInfo.responseObject;
						  }
						  if(detailInfo.status == "success")
						  {
						  $rootScope.scc();
						  }

                        });	
		 }
		 $scope.cancalHot = function()
		 {
		
		  $scope.error = false;
		 // $scope.availableKeys = $scope.keys;
		  console.log($scope.addedHotKeys);
		  for(var i=0;i<$scope.addedHotKeys.length;i++)
		  {
		 //$scope.availableKeys.push($scope.addedHotKeys[i]);	
		 }
		 $scope.addedHotKeys =[];
		 
		 };

    }

]);



app.controller('accountGroupController', ['$scope', '$http', '$sce','$timeout',
    function ($scope, $http, $sce, $timeout) {

        $http({

            method: "GET",

            url: "js/json/prefrences1.json"

        }).then(function (response) {

            $scope.preferencesData = angular.fromJson(response.data.responseObject.linkedAccounts);
            $scope.preferencesData.unshift(response.data.responseObject.primaryAccounts[0]);
            console.log($scope.preferencesData);



        });


  
  $scope.accountGroup = function(){

	/*
	  var accountObj='';
		  var jsonObj =[];
			
		    for(var i=0;i<$scope.preferencesData.length;i++){
		      var x = '$scope.primaryAccounts['+i+'].accVarName';
			  var y = '$scope.primaryAccounts['+i+'].accSelName';
			  var z = '$scope.primaryAccounts['+i+'].accNum';
			  console.log(x);
		      
			  if($scope.preferencesData[i].accVarName!='accName' && $scope.preferencesData[i].accVarName!=undefined)
			  {
			  var obj = {};
			  obj[x] = $scope.preferencesData[i].accVarName;
			  obj[y] = $scope.preferencesData[i].accSelName;
			  obj[z] = $scope.preferencesData[i].accountId;
		      jsonObj.push(obj);			  
			  accountObj += $.param(jsonObj[i]);
			  }
		    }
			console.log(accountObj);
		//accountObj={accountGroup:jsonObj};
		//console.log(accountObj);
		*/

      $scope.info = {};

      $scope.info['org.apache.struts.taglib.html.TOKEN'] = $scope.token;
      $scope.info['submitChanges.x'] = "1";
      for(var i=0;i<$scope.preferencesData.length;i++){
          if(i==0) {
              var x = '$scope.primaryAccounts[' + i + '].accountId';
              var y = '$scope.primaryAccounts[' + i + '].accountName';
              var z = '$scope.primaryAccounts[' + i + '].groupId';
          }
          else
          {
              var x = '$scope.linkedAccounts[' + i + '].accountId';
              var y = '$scope.linkedAccounts[' + i + '].accountName';
              var z = '$scope.linkedAccounts[' + i + '].groupId';

          }
                if($scope.preferencesData[i].accVarName!=undefined) {
                    $scope.info[x] = $scope.preferencesData[i].accountId;
                    $scope.info[y] = $scope.preferencesData[i].accountVarName;
                    $scope.info[z] = $scope.preferencesData[i].accountSelectName;
                }
      }

      console.log($scope.info);

		$http({

                            method: 'POST',

                            url: '/demobps/useridpasswordsettings.do;jsessionid=6B5DC3A3701CE41534EC0E0E3DD7D065',

                            data: $scope.info,

                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }

                        }).success(function (response) {

                            var detailInfo = angular.fromJson(response);

                          if(detailInfo.status == "error")
						  {
						  $scope.accountGroupInfo.errors = detailInfo.responseObject;
						  }
						  if(detailInfo.status == "success")
						  {
						  $rootScope.scc();
							
						  }

                        });	
    
  };	
  
  $scope.cancelGroup = function(){
  for(var i=0;i<$scope.preferencesData.length;i++)
  {
  delete $scope.preferencesData[i].accVarName;
  delete $scope.preferencesData[i].accSelName;
  
  }
  };
  
	
		
    }

]);
// Placeholder for non HTML5 browsers
app.directive("ngPlaceholder", function($log, $timeout) {
	var txt;
	return {
		restrict: "A",
		//scope: true,
		link: function(scope, elem, attrs) {
			scope.txt = attrs.ngPlaceholder;
			
			/*elem.bind("focus", function() {
				if(elem.val() === scope.txt) {
					elem.val("");
				}
				scope.$apply()
			})

			elem.bind("blur", function() {
				if(elem.val() === "") {
					elem.val(scope.txt);
				}
				scope.$apply()
			})
			*/
			// Initialise placeholder
			$timeout(function() {
				elem.val("")
				scope.$apply();
			})
		}
	}
});
app.directive('autoGrow', function() {
    return function(scope, element, attr){
        var minHeight = element[0].offsetHeight,
            paddingLeft = element.css('paddingLeft'),
            paddingRight = element.css('paddingRight');

        var $shadow = angular.element('<div></div>').css({
            position: 'absolute',
            top: -10000,
            left: -10000,
            width: element[0].offsetWidth - parseInt(paddingLeft || 0) - parseInt(paddingRight || 0),
            fontSize: element.css('fontSize'),
            fontFamily: element.css('fontFamily'),
            lineHeight: element.css('lineHeight'),
            resize: 'none'
        });
        angular.element(document.body).append($shadow);

        var update = function() {
            var times = function(string, number) {
                for (var i = 0, r = ''; i < number; i++) {
                    r += string;
                }
                return r;
            }

            var val = element.val().replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/&/g, '&amp;')
                .replace(/\n$/, '<br/>&nbsp;')
                .replace(/\n/g, '<br/>')
                .replace(/\s{2,}/g, function(space) { return times('&nbsp;', space.length - 1) + ' ' });
            $shadow.html(val);

            element.css('height', Math.max($shadow[0].offsetHeight + 10 /* the "threshold" */, minHeight) + 'px');
        }

        element.bind('keyup keydown keypress change', update);
        update();
    }
});
