'use strict';

var myApp = angular.module('PokemonGoApp', ['ngSanitize', 'ui.router']);

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
		//console.log(response.data)
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
	var number = "";
	var poke ="";
	$http.get('data/kanto.json').then(function (response) {
		number = $stateParams.pokemon;
		poke = response.data;
		console.log(number);
		var pokedex = response.data.pokemon_entries[number - 1];
		console.log(pokedex);
		var url = pokedex.pokemon_species.url;
		console.log(url);
		$scope.pokedex = pokedex;

		$http({
			url: url, 
			method: "GET"
		}).then(function(response){
			var data = response.data;
			console.log(data);
			$scope.pokemon = data;
			if (data.evolves_from_species !== null) {
				console.log('Im in');
				console.log(number);
				var pokedexBefore = poke.pokemon_entries[number - 2];
				$scope.pokedexBefore = pokedexBefore;
			} else {
				$('<p>No evolution before this!</p>').appendTo('#text');
			}
		});
	})
}]);

myApp.controller('WishlistCtrl', ['$scope', '$http', '$filter', function($scope, $http, $filter) {

}]);