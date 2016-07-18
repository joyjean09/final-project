'use strict';

var myApp = angular.module('PokemonGoApp', ['ngSanitize', 'ui.router']);
//configure ui router; urlRouteProvider is default route if no other states are matched
myApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'partials/home.html',
			controller: 'HomeCtrl'
		})

		.state('pokedex', {
			url: '/pokedex',
			templateUrl: 'partials/pokedex.html',
			controller: 'PokedexCtrl'
		})

		.state('items', {
			url: '/items',
			templateUrl: 'partials/items.html',
			controller: 'ItemsCtrl'
		})

		.state('detail', {
			url: '/detail/:pokemon.entry_number',
			templateUrl: 'partials/detail.html',
			controller: 'DetailCtrl'
		})

		.state('wishlist', {
			url: '/wishlist',
			templateUrl: 'partials/wishlist.html',
			controller: 'WishlistCtrl'
		})
	$urlRouterProvider.otherwise('/pokedex');
}]);

myApp.controller('HomeCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
	$http.get('data/game-descriptions.json').then(function (response) {
		var descriptions = response.data;
		$scope.descriptions = descriptions;
		//console.log(response.data)
	});

	$scope.toggle = function (id) {
		var block = document.getElementById(id);
		if (block.style.display == 'block') {
			block.style.display = 'none';
		} else {
			block.style.display = 'block';
		}
	}

}]);

myApp.controller('PokedexCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
	$http.get('data/kanto.json').then(function (response) {
		var data = response.data.pokemon_entries;
		$scope.pokedex = data;
	});
}]);

myApp.controller('ItemsCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
	$http.get('data/item-list.json').then(function (response) {
		var data = response.data.data;
		$scope.items = data;
		console.log($scope.items);
	});
	$scope.ordering = "name";
	$scope.sortBy = function (par) {
		$scope.ordering = par;
	}
}]);

myApp.controller('DetailCtrl', ['$scope', '$http', '$filter', '$stateParams', 'PokeListService', function ($scope, $http, $filter, $stateParams, PokeListService) {
	var number = "";
	var poke = "";
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
		}).then(function (response) {
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
	});
	$scope.addProduct = function (product, pokedex) {
		PokeListService.addProduct(product, pokedex);
		//console.log("saved ",localStorage.wishlist)
	};
}]);

myApp.controller('WishlistCtrl', ['$scope', '$http', '$filter', 'PokeListService', function ($scope, $http, $filter, PokeListService) {
	$scope.wishlist = PokeListService.wishlist;
	$scope.ordering = "detail.names[0].name";
	$scope.removePokemon = function (item) {
		PokeListService.remove(item);
	}
}]);

myApp.factory('PokeListService', function () {
	var service = {};

	if (localStorage.wishlist !== undefined) {
		service.wishlist = JSON.parse(localStorage.wishlist);
		//console.log(service.wishlist);
	}
	else {
		service.wishlist = [];
	}

	service.addProduct = function (product, pokedex) {
		service.wishlist.push({ 'detail': product, 'pokedex': pokedex });
		localStorage.wishlist = JSON.stringify(service.wishlist);
		console.log("saved ", localStorage.wishlist)
	};

	/*service.remove = function (item) {
		var index = service.wishlist.indexOf(item);
		service.wishlist.splice(index, 1);
		localStorage.wishlist = service.wishlist;
	}*/

	return service;
});