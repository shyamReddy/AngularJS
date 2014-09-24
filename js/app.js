var app = angular.module('brMobile',['ngRoute', 'ngSanitize', 'ui.bootstrap', 'ngTable', 'ngTouch']);

app.config(['$routeProvider', '$controllerProvider', '$provide', '$filterProvider', '$compileProvider', function ($routeProvider, $controllerProvider, $provide, $filterProvider, $compileProvider) {
	$routeProvider
		.when('/dashboard', {
			templateUrl: 'dashboard.htm',
			controller: 'dashboardCtrl',
			title: 'Dashboard'
		})
		.when('/positions', {
			templateUrl: 'positions.htm',
			controller: 'positionsCtrl',
			title: 'Holdings'
		})
		.when('/stockorder', {
			templateUrl: 'stockorder.htm',
			controller: 'stockOrderCtrl',
			title: 'Equity Order'
		})
        .when('/optionorder', {
            templateUrl: 'optionorder.html',
            controller: 'stockOrderCtrl',
            title: 'Equity Order'
        })
		.when('/watchlist', {
			templateUrl: 'watchlist.htm',
			controller: 'watchlistCtrl',
			title: 'Watchlist'
		})
		.when('/account-profile', {
			templateUrl: 'templates/account-profile.html',
			controller: 'accountProfileController',
			title: 'Account Profile'
		})
		.when('/account-activity', {
			templateUrl: 'templates/account-activity.html',
			controller: 'accountActivityController',
			title: 'Account Activity'
		})
        .when('/profile', {
            templateUrl: 'profile.htm',
            controller: 'profileCtrl',
            title: 'Profiles'
        })
        .when('/balances', {
            templateUrl: 'templates/balances.html',
            controller: 'balancesCtrl',
            title: 'Balances'
        })
        .when('/preferences', {
			templateUrl: 'templates/preferences.html',
			controller: 'preferencesController',
			title: 'Preferences'
		})
		.otherwise({
			redirectTo: '/dashboard'
		});

	/**
	 * override angular default module api for creating components
	 * @type {Function|register|register|register}
	 */
	app.controller = $controllerProvider.register;
	app.service = $provide.service;
	app.factory = $provide.factory;
	app.filter = $filterProvider.register;
	app.directive = $compileProvider.directive;
}]);

app.directive('brNavigationMenu', ['$document', function($document) {
	return {
		restrict: 'E',
		templateUrl: 'templates/navigationmenu.htm',
		link: function(scope, element, attrs) {

			var documentBindingInitialized = false;
			var documentClickBind = function(event) {

				if (scope.navigation.sideOpen && element.find(event.target).length == 0) {
					scope.$apply(function() {
						scope.navigation.sideOpen = false;
					});
				}
//				if (scope.navigation.sideOpen) {
//					element.find('.leftMenu').height(Math.round($document.height() * 0.888) + 'px');
//				}
			};

			scope.$watch('navigation.sideOpen', function(value) {
				if (value) {
					$document.bind('click', documentClickBind);
					documentBindingInitialized = true;
				} else {
					if (documentBindingInitialized) {
						$document.unbind('click', documentClickBind);
					}
				}
			});
		}
	}
}]);

app.directive('brAccountMenu', ['$document', function($document) {
	return {
		restrict: 'E',
		templateUrl: 'templates/accountmenu.htm',
		link: function(scope, element, attrs) {
			$document.bind('click', function(event) {
				if (scope.accounts.showSelector) {
					if (element.find(event.target).length == 0) {
						scope.$apply(function () {
							scope.accounts.showSelector = false;
						});
					}
				}
			});
		}
	}
}]);

app.directive('brFavoritesMenu', ['$document', function($document) {
	return {
		restrict: 'E',
		templateUrl: 'templates/favoritesmenu.htm'
	}
}]);

app.controller('WidgetSliderController', ['$scope', '$http', '$attrs', function ($scope, $http, $attrs) {
	$scope.pageId = $attrs.pageid;

	$scope.widgetDef = {
		selectedIndex : 999,
		definition: null
	};
	$scope.currentWidget = null;

	/* Change to show next available widget defined for page */
	$scope.changeWidget = function(moduleIncrement) {
		for (var i = 0; i < $scope.widgetDef.definition.length; i++) {
			$scope.widgetDef.selectedIndex = $scope.widgetDef.selectedIndex + moduleIncrement;
			if ($scope.widgetDef.selectedIndex < 0) {
				$scope.widgetDef.selectedIndex = $scope.widgetDef.definition.length - 1;
			} else if ($scope.widgetDef.selectedIndex >= $scope.widgetDef.definition.length) {
				$scope.widgetDef.selectedIndex = 0;
			}
			if ($scope.widgetDef.definition[$scope.widgetDef.selectedIndex].usedOn.indexOf($scope.pageId) > -1) {
				if (!$scope.widgetDef.definition[$scope.widgetDef.selectedIndex].initialized) {
					$scope.moduleInit($scope.widgetDef.selectedIndex);
				}
				$scope.currentWidget = $scope.widgetDef.definition[$scope.widgetDef.selectedIndex];
				break;
			}
		}
	};

	/* Get data for selected widget */
	$scope.moduleInit = function(theIndex) {
		$http.get($scope.widgetDef.definition[theIndex].dataSrc)
			.then(function (result) {
				$scope.widgetDef.definition[theIndex].data = result.data;
				$scope.widgetDef.definition[theIndex].initialized = true;
			}
		);
	};

	/* Initialize widget definitions */
	$http({
		method: "GET",
		url: "js/json/widget-definition.json"
	}).then(function(response) {
		$scope.widgetDef.definition =  angular.fromJson(response.data);
		// initial module state
		$scope.changeWidget(1);
	});

}]);

/**
 * @ngdoc directive
 * @name brMobile.brWidgetSlider
 * @restrict E
 *
 * @description
 * Widget to load and display a set of pages sliding left/right based on user input
 *
 * @param {pageId=} the page id which is used to filter the available pages
 * @param {initialHeight=} initial height of the widget
 * @param {expandedHeight=} widget's expanded height. Setting initialHeight and expandedHeight will enable expand/collapse icon
 *
 * @example
 	1) <br-widget-slider pageId="dashboard" initial-height="initialHeight" expanded-height="expandedHeight"/>
 	2) <br-widget-slider pageId="dashboard"/>
 */
app.directive('brWidgetSlider', ['$document', function($document) {
	return {
		restrict: 'E',
		templateUrl: 'templates/widgetslider.htm',
		link: function(scope,element,attrs) {
			scope.expandCollapse=angular.isDefined(attrs.handler);
			var widgetHeader = $(".widgetHeader",$(element).parent()).first();
			$(widgetHeader).on("click",function(){
				scope.$apply(scope.handler());
			});
		},
		scope: {
			pageId: '&pageId',
			handler: '&handler'
		},
		controller: 'WidgetSliderController'
	}
}]);

app.directive('brOrient', ['$window', function($window) {
	return {
		restrict: 'A',		
		link: function(scope,element,attrs) {
			if(window.innerWidth <= window.innerHeight) {
				element.find("#portraitMode").show();
				element.find("#landscapeMode").hide();
			} else {
				element.find("#portraitMode").hide();
				element.find("#landscapeMode").show();
			}
			
			angular.element($window).bind("orientationchange", function() {
				if ($window.orientation == 0) {
					element.find("#portraitMode").show();
					element.find("#landscapeMode, .modal-dialog, .modal-backdrop.in").hide();
				} else {
					element.find("#portraitMode, .modal-dialog, .modal-backdrop.in").hide();
					element.find("#landscapeMode").show();
				}				
			});	
			
		}		
	}
}]);
app.directive('placeholder', function($interpolate) {
//app.directive('select', function($interpolate) {
    console.log('in dir');
    return {
        restrict: 'E',
        //require:'ngModel',
        scope:{
            selectedvalue :'='
        },
        link: function(scope, elem, attrs, ctrl) {
          //  if(elem[0].nodeName == 'SELECT') {
                console.log(elem);
                var defaultOption;

                console.log('selectedvalue', scope.selectedvalue);
                scope.defaultOptionText = attrs.placeholder;
            console.log("PlaceHolder : ",attrs.placeholder);
               //defaultOption = '<option value="" disabled selected style="display: none;">{{defaultOptionText}}</option>';
               defaultOption = '<option value="Select">{{defaultOptionText}}</option>';


                elem.prepend($interpolate(defaultOption)(scope));
                //console.log(scope.defaultOptionText);

            }
       // }
    };
});
app.directive('animatedView', ['$route', '$anchorScroll', '$compile', '$controller', function ($route, $anchorScroll, $compile, $controller) {

    return {
        restrict: 'ECA',
        terminal: true,
        link: function (scope, element, attr) {
            var lastScope,
                onloadExp = attr.onload || '',
                defaults = { duration: 500, viewEnterAnimation: 'slideLeft', viewExitAnimation: 'fadeOut', slideAmount: 50, disabled: false },
                locals,
                template,
                options = scope.$eval(attr.animations);

            angular.extend(defaults, options);

            scope.$on('$routeChangeSuccess', update);
            update();


            function destroyLastScope() {
                if (lastScope) {
                    lastScope.$destroy();
                    lastScope = null;
                }
            }

            function clearContent() {
                element.html('');
                destroyLastScope();
            }

            function update() {
                locals = $route.current && $route.current.locals;
                template = locals && locals.$template;

                if (template) {
                    if (!defaults.disabled) {
                        if (element.children().length > 0) { //Have content in view
                            animate(defaults.viewExitAnimation);
                        }
                        else { //No content in view so treat it as an enter animation
                            animateEnterView(defaults.viewEnterAnimation);
                        }
                    }
                    else {
                        bindElement();
                    }

                } else {
                    clearContent();
                }
            }

            function animateEnterView(animation) {
                $(element).css('display', 'block');
                bindElement();
                animate(animation);
            }

            function animate(animationType) {
                switch (animationType) {
                    case 'fadeOut':
                        $(element.children()).animate({
                            //opacity: 0.0,
                        }, defaults.duration, function () {
                            animateEnterView('slideLeft');
                        });
                        break;
                    case 'slideLeft':
                        $(element.children()).animate({
                            left: '-=' + defaults.slideAmount,
                            opacity: 1.0
                        }, defaults.duration);
                        break;
                    case 'slideRight':
                        $(element.children()).animate({
                            left: '+=' + defaults.slideAmount,
                            opacity: 1.0
                        }, defaults.duration);
                        break;
                }
            }

            function bindElement() {
                element.html(template);
                destroyLastScope();

                var link = $compile(element.contents()),
                    current = $route.current,
                    controller;

                lastScope = current.scope = scope.$new();
                if (current.controller) {
                    locals.$scope = lastScope;
                    controller = $controller(current.controller, locals);
                    element.children().data('$ngControllerController', controller);
                }

                link(lastScope);
                lastScope.$emit('$viewContentLoaded');
                lastScope.$eval(onloadExp);

                // $anchorScroll might listen on event...
                $anchorScroll();
            }
        }
    };
}]);



