'use strict';

var myApp = angular.module('PokemonGoApp', ['ngSanitize', 'ui.router']);
function toggle_visibility(id) {
       var e = document.getElementById(id);
       if(e.style.display == 'block') {
          e.style.display = 'none';
	   }else{
          e.style.display = 'block';
	   }
	}
//configure ui router; urlRouteProvider is default route if no other states are matched
myApp.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider){

	$stateProvider
	.state('home', {
		url:'/home',
		templateUrl: 'partials/home.html',
		controller:'HomeCtrl'
	})
	
	.state('pokedex', {
		url:'/pokedex',
		templateUrl: 'partials/pokedex.html',
		controller:'PokedexCtrl'
	})

	.state('items', {
		url:'/items',
		templateUrl: 'partials/items.html',
		controller:'ItemsCtrl'
	})

	.state('detail', {
		url:'/detail/:pokemon.entry_number',
		templateUrl:'partials/detail.html',
		controller:'DetailCtrl'
	})
	
	.state('wishlist', {
		url:'/wishlist',
		templateUrl:'partials/wishlist.html',
		controller:'WishlistCtrl'
	})
	$urlRouterProvider.otherwise('/pokedex');
}]);

myApp.controller('HomeCtrl', ['$scope', '$http', '$filter', function($scope, $http, $filter) {
	$http.get('data/game-descriptions.json').then(function (response) {
		var descriptions = response.data;
		$scope.descriptions = descriptions;
		console.log(response.data)
	});
}]);

myApp.controller('PokedexCtrl', ['$scope', '$http', '$filter', function($scope, $http, $filter){
	$http.get('data/kanto.json').then(function (response) {
		var data = response.data.pokemon_entries;   
		//console.log(response.data.pokemon_entries);
		$scope.pokedex = data;
	});
}]);

myApp.controller('ItemsCtrl', ['$scope', '$http', '$filter', function($scope, $http, $filter) {

}]);

myApp.controller('DetailCtrl', ['$scope', '$http', '$filter', '$stateParams', function($scope, $http, $filter, $stateParams) {
	/*var objectDetail = {};*/
	$http.get('data/kanto.json').then(function (response) {
		var pokedex = response.data.pokemon_entries;
		console.log(pokedex);
		var targetObj = $filter('filter')(pokedex, { //filter the array
			entry_number: $stateParams.pokemon //for items whose id property is targetId
		}, true)[0]; //save the 0th result
		console.log(targetObj);
		//var url = targetObj.pokemon_species.url;
		console.log(url);
		/*$http({
			url: 'http://pokeapi.co/api/v2/pokemon-species/', 
			method: "GET"
		}).then(function(response){
			var data = response.data;
			//console.log(data);
			pictures.push(data);
			console.log(pictures);
		});*/
			// objectDetail = targetObj;
			// console.log(objectDetail);
			//$scope.product = targetObj;
	})
}]);

myApp.controller('WishlistCtrl', ['$scope', '$http', '$filter', function($scope, $http, $filter) {

}]);