(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItems);


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var narrowMenu = this;

  narrowMenu.searchItem = "";
  narrowMenu.foundItems = "";

  narrowMenu.narrowDown = function (){

    if(narrowMenu.searchItem){

      narrowMenu.noItemsFounded = "";
      var promise = MenuSearchService.getMatchedMenuItems(narrowMenu.searchItem.toLowerCase());

      promise.then(function (response) {

        if(response.length == 0){
          // narrowMenu.noItemsFounded = "NOTHING FOUND!";
          narrowMenu.noItemFound = MenuSearchService.noItemFound(true);
        }else{
          narrowMenu.noItemFound = MenuSearchService.noItemFound(false);
        }
        narrowMenu.foundItems = response;

      })
      .catch(function (error) {
        console.log("Something went terribly wrong.");
      });

    }else {
      console.log("The search is empty");
      narrowMenu.foundItems = "";
      narrowMenu.noItemFound = MenuSearchService.noItemFound(true);
    }
  }

  narrowMenu.removeItem = function (itemIndex){

    narrowMenu.foundItems.splice(itemIndex, 1);
  }

}


  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {

      var result = $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      }).then(function (result) {

        var response = [];
        for(var i = 0; i < result.data.menu_items.length; i++){

          var description = result.data.menu_items[i].description;

          if(description.toLowerCase().indexOf(searchTerm) !== -1){

            response.push({
              name: result.data.menu_items[i].name,
              short_name: result.data.menu_items[i].short_name,
              description: result.data.menu_items[i].description
            });
          }
        }
        return response;
      })
      .catch(function (result) {
        console.log("Something went wrong");
      });

      return result;
    };



    service.noItemFound = function(hide){

      return hide;
    }

  }



  function FoundItems(){

    var ddo = {
      templateUrl: 'itemFounded.html',
        scope: {
            items: '<',
            onRemove: '&'
        },
        controller: NarrowItDownController,
        controllerAs: 'narrowMenu',
        bindToController: true
    };

    return ddo;
  }

})();
