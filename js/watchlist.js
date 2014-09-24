//watchlist
app.controller('watchlistCtrl', function($scope,$http) {
    $http({
        method: 'GET',
        url: "js/json/watchlist.json"

    }).success(function (resp) {
        $scope.StockList = resp;
        console.log($scope.StockList);


        });

    $scope.custom = true;
    $scope.watchlistshowaddbox = true;
    $scope.showExpandView = false;
    $scope.showRegularView = true;
    $scope.addedit = true;

    $scope.deleteStock = function (index, watchlist, event) {
         event.stopPropagation();
        console.log(watchlist);
        watchlist.contents.splice(index, 1);
    };

    $scope.currIndex;
    $scope.currWatchlist;
    $scope.addStock = function (element, index, watchlist) {
        $scope.stockInputSym = "";
        $scope.watchlistshowaddbox = !$scope.watchlistshowaddbox;
        $scope.currIndex = index;
        $scope.currWatchlist = watchlist;
    };

    $scope.currStocks = $scope.singleStock =[
        {
            "description": "Wells Fargo",
            "symbol": "WF",
            "LastTradePrice": "1,158.72",
            "todayChange": "+0.79",
            "todayPercentChange": "0.0%",
            "gainAndLost": "$14,500.50"
        }
    ];

    $scope.expand = false;
    $scope.expandCurrStocks= function(stocks,index, event){
        $scope.expand = !$scope.expand;
        if($scope.expand){
            $scope.selected1 = index;
            $scope.selected =index;
        }
        else
        {
            $scope.selected1 = -1;
            $scope.selected = -1;

        }
        $scope.showScrollBar = "hidden";
    };
    $scope.detail = true;
    $scope.expandStockDetail = function(event, index, post)
    {

            $scope.singleStock = post;
            console.log($scope.singleStock);
            $scope.detail = false;
            $scope.showScrollBar = "hidden";
            angular.element('body').css('overflow', 'hidden');


    };
    $scope.closeDetails = function(){
        $scope.detail = true;
        angular.element('body').css('overflow', 'visible');
            };
    $scope.edit =function(event){
        event.stopPropagation();
    };


    $scope.fetchStockSymbol = function () {
        console.log($scope.fetchStockSymbol);
        alert("you entered - " + $scope.stockInputSym)
        $http({
            method: 'GET',
            url: "js/json/watchlist.json"

        }).success(function (resp) {
            //hide the add box
            $scope.watchlistshowaddbox = true;

            //only work is left to find the correct  stock item from JSON and Map it  -for now hard coding it
            var obj = {
                "description": $scope.stockInputSym,
                "symbol": "WF",
                "LastTradePrice": "1,158.72",
                "todayChange": "+0.79",
                "todayPercentChange": "0.0%",
                "gainAndLost": "$14,500.50"
            }
            //update the json data to insert the newly added stock name
            $scope.currWatchlist.contents.splice(0, 0, obj);


        });
    }
});
app.directive('edit',function(){
    return{
        link: function (scope, element, attrs) {
            element.bind('click', function () {
                var  myEdit= element.parents('.watchlist-left-area').next();
                if(myEdit.hasClass('addOpacity'))
                {
                    myEdit.removeClass('addOpacity');
                    myEdit.find('.delete-stock').addClass('ng-hide').removeClass('ng-show');

                }
                else
                {
                    angular.element('.watchlist-right-area').removeClass('addOpacity');
                    myEdit.addClass('addOpacity');
                    myEdit.find('.delete-stock').removeClass('ng-show').addClass('ng-hide');
                    myEdit.find('.delete-stock').addClass('ng-show').removeClass('ng-hide');
                }

            })
        }
    }
});
app.directive('addedittoggle',function() {
    return{
        link: function (scope, element, attrs) {
            element.bind('click', function () {
                var defaultheight;
                if(!element.hasClass('activeClass')){
                    angular.element('.watchlist-my-right').removeClass('current');
                    element.next().addClass('current');
                    var myheight = angular.element('.current')[0].clientHeight;
                    defaultheight=angular.element('.watchlist-left-area')[0].clientHeight/16;
                    angular.element('.watchlist-left-area').find('.watchlist-scroll').css('position', 'none');
                    angular.element('.watchlist-left-area').css('height', '11.45em').removeClass('activeClass')
;                    element.css('height',myheight).addClass('activeClass');
                   // element.find('.watchlist-add-edit').addClass('expandPadding');
                }
                else
                {

                    var myRight = element.parent().find('.watchlist-my-right');
                    element.css('height',defaultheight+'em').removeClass('activeClass');
                    element.find('.watchlist-scroll').css('position','none');
                    myRight.removeClass('current');
                    //Hack
                    myRight.addClass('notactive');
                    myRight.offset();
                    myRight.removeClass('notactive');
                    //END HACK

                }
            })
        }
    }
});
app.directive('add',function(){
    return{
        link:function(scope, element, attrs){
            element.bind('click',function(){
                var divtop = element.parents('.watchlist-left-area')[0].offsetTop;
                angular.element('.watchlist-add-box').css('top',divtop)
            })
        }
    }
});
app.directive('scroll',function($window){
   return function(scope,element, atts){
       angular.element('.watchlist-wrapper').bind('scroll',function(){
          var mytop = angular.element('.watchlist-wrapper').scrollTop();
           if(angular.element('.watchlist-left-area').hasClass('activeClass'))
           {
               if(angular.element('.watchlist-wrapper').scrollTop() >= angular.element('.activeClass')[0].offsetTop
                   && angular.element('.watchlist-wrapper').scrollTop() <= angular.element('.activeClass')[0].offsetTop+angular.element('.activeClass').height()-270)
               {
                   angular.element('.activeClass').find('.watchlist-scroll').animate({'top':mytop},10).css({'position':'absolute'});

               }
           }
           scope.$apply();

       });
   }
});
app.directive('focusMe', function($timeout) {
    return {
        scope: { trigger: '=focusMe' },
        link: function(scope, element) {
            scope.$watch('trigger', function(value) {
                if(value === true) {
                    //console.log('trigger',value);
                    //$timeout(function() {
                    element[0].focus();
                    scope.trigger = false;
                    //});
                }
            });
        }
    };
});

//# sourceURL=watchlist.js
