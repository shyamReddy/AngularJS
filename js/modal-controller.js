
/*
 Modal Box for displaying Messages
 Created by Jeewan on 06/03/2014
*/

app.controller('modalController', ['$scope', '$modal', '$http', function($scope, $modal, $http) {

  $scope.openMessageBox = function () {

    var modalInstance = $modal.open({
      templateUrl: 'templates/modal-box.html',
      controller: ModalInstanceController    
    });    
  };
  
}]);


var ModalInstanceController = function ($scope, $modalInstance, $http) {
	$scope.buttonValue = "Edit";
	$scope.emptyMessage = false;
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
	
	$scope.showNew = new Array();
	
	$http({
		method: "GET",
		url: "js/json/message-center.json"
			}).then(function(response){
				$scope.messageCenter =  angular.fromJson(response.data);
				$scope.detailMessage = $scope.messageCenter[0];
				$scope.messageLength = $scope.messageCenter.length;
			});
	
	$scope.open = function(idx) {
		$scope.detailMessage = $scope.messageCenter[idx];
	}
	
	$scope.selectedIndex = 0;
	
	$scope.messageClicked = function ($index) {
		$scope.selectedIndex = $index;
	}
	
	$scope.defaultCheckState = false;
	$scope.chckedIndexArray = [];
	
	$scope.checkedIndex = function (messages) {
		if ($scope.chckedIndexArray.indexOf(messages) === -1) {
			$scope.chckedIndexArray.push(messages);
		} else {
			$scope.chckedIndexArray.splice($scope.chckedIndexArray.indexOf(messages), 1);
		}
	}
	
	$scope.swipeIndex = [];
	
	$scope.deleteItem = function(index){
		$scope.showcheckbox = !$scope.showcheckbox;
		$scope.swipeIndex = [];
		angular.forEach($scope.chckedIndexArray, function (value, index) {
			var index = $scope.messageCenter.indexOf(value);
			$scope.messageCenter.splice($scope.messageCenter.indexOf(value), 1);
			if(index < $scope.messageCenter.length) {
				$scope.detailMessage = {
						"subject": $scope.messageCenter[index].subject,
						"from": $scope.messageCenter[index].from,
						"date": $scope.messageCenter[index].date,
						"messageText" : $scope.messageCenter[index].messageText
					};
				$scope.selectedIndex = index;
			}
			
			if($scope.messageCenter.length == 0) {
				$scope.emptyMessage = true;
			}
		});
		$scope.messageLength = $scope.messageCenter.length;
		$scope.chckedIndexArray = [];
	};
	
	
	$scope.swipped = function(index) {
		$scope.swipeIndex[index] = !$scope.swipeIndex[index];
		$scope.showcheckbox = null;
	};
	
	$scope.deleteClicked = function(index) {
		$scope.messageCenter.splice(index, 1);
		$scope.swipeIndex[index] = !$scope.swipeIndex[index];
		$scope.swipeIndex[index] = null; 
		document.getElementsByClassName("editDeleteButton")[0].setAttribute("value", "Edit"); 
		  
		if(index < $scope.messageCenter.length) {
			$scope.detailMessage = {
					"subject": $scope.messageCenter[index].subject,
					"from": $scope.messageCenter[index].from,
					"date": $scope.messageCenter[index].date,
					"messageText" : $scope.messageCenter[index].messageText
				};
			$scope.selectedIndex = index;
		}
		
		if($scope.messageCenter.length == index) {
			if(index != 0) {
				$scope.selectedIndex = index-1;
				$scope.detailMessage = {
						"subject": $scope.messageCenter[index-1].subject,
						"from": $scope.messageCenter[index-1].from,
						"date": $scope.messageCenter[index-1].date,
						"messageText" : $scope.messageCenter[index-1].messageText
					};
			} else {
				$scope.emptyMessage = true;
			}			
		}
		
		$scope.messageLength = $scope.messageCenter.length;
	} // $scope.deleteClicked function ends
	
};


app.directive('editdelete', function () {
    return {
        restrict: 'A',
        template: '',
        link: function (scope, elem, attrs) {
            elem.bind("click", function () {
                if (elem.val() == "Delete") {
                    elem.val("Edit");
                } else {
                    elem.val("Delete");
                }
            })
        }
    }
});

