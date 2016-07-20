'use strict';

var myApp = angular.module('PokemonGoApp', ['ngSanitize', 'ui.router', 'ui.bootstrap']);
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
		.state('news', {
			url: '/news',
			templateUrl: 'partials/news.html',
			controller: 'NewsCtrl'
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
	// Calls the kanto.json data
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
	var test = {};
	// Calls the kanto data
	$http.get('data/kanto.json').then(function (response) {
		number = $stateParams.pokemon;
		poke = response.data;
		console.log(number);
		var pokedex = response.data.pokemon_entries[number - 1];
		console.log(pokedex);
		var url = pokedex.pokemon_species.url;
		$scope.pokedex = pokedex;

		// get an individual pokemon's API in the database.
		$http({
			url: url,
			method: "GET"
		}).then(function (response) {
			var data = response.data;
			$scope.pokemon = data;
			console.log(data);
			if (data.evolves_from_species !== null) {
				console.log('Im in');
				console.log(number);
				var pokedexBefore = poke.pokemon_entries[number - 2];
				$scope.pokedexBefore = pokedexBefore;
			} else {
				$('<p>No evolution before this!</p>').appendTo('#text');
			}
			test = data;
			console.log('test: ');
			console.log(test);
		});
	});

	// Add pokemon to wish list
	$scope.addProduct = function (product, pokedex) {
		PokeListService.addProduct(product, pokedex);
		showDiv('addedMessage');
	};

	// check if the page data is loaded
	// If not loaded then a loading page shows up.
	// Page content desplays after data is loaded.
	function onReady(callback) {
		var intervalID = window.setInterval(checkReady, 1000);
		function checkReady() {
			if (Object.keys(test).length !== 0) {
				//console.log('inside checkReady if statement');
				//console.log('test length');
				//console.log(Object.keys(test).length);
				window.clearInterval(intervalID);
				callback.call(this);
			}
		}
	}

	// Show the page when loaded.
	function show(id, value) {
		document.getElementById(id).style.display = value ? 'block' : 'none';
	}

	// Calls the two checking function whenever a page is loaded.
	onReady(function () {
		show('detailPageMain', true);
		show('loading', false);
	});

	// Shows message of "Added to wishlist!" after pressign add to wish list button
	function showDiv(id) {
		document.getElementById(id).style.display = "block";
	}
}]);

myApp.controller('WishlistCtrl', ['$scope', '$http', '$filter', '$uibModal', 'PokeListService', function ($scope, $http, $filter, $uibModal, PokeListService) {
	$scope.wishlist = PokeListService.wishlist;
	$scope.ordering = "detail.names[0].name";

	$scope.confirm = function (selectedItem) {
		$scope.item = selectedItem;
		var modalInstance = $uibModal.open({
			templateUrl: 'partials/confirmation-modal.html', //partial to show
			controller: 'ModalCtrl', //controller for the modal
			scope: $scope //pass in all our scope variables!
		});
	}
}]);


myApp.controller('NewsCtrl', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
	$http({
		url: "https://api.nytimes.com/svc/search/v2/articlesearch.json",
		method: "GET",
		params: { 'api-key': "7472833e4b4e4e20b63a1ec2c443be2a", 'q': "pokemon", 'sort': "newest" }
	}).then(function (data) {
		var news = data.data.response.docs;
		$scope.news = news;
		console.log(news);
	})
}]);


myApp.controller('ModalCtrl', ['$scope', '$uibModalInstance', 'PokeListService', function ($scope, $uibModalInstance, PokeListService) {
	

	$scope.ok = function (item) {
		console.log($scope.wishlist);
		var index = $scope.wishlist.indexOf(item);
		var wishlist = $scope.wishlist.splice(index, 1);
		console.log($scope.wishlist);
		PokeListService.updateList($scope.wishlist);
		$scope.wishlist = PokeListService.wishlist;
		$uibModalInstance.dismiss('cancel');
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};

}]);

myApp.factory('PokeListService', function () {
	var service = {};

	if (localStorage.wishlist !== undefined) {
		service.wishlist = JSON.parse(localStorage.wishlist);
	}
	else {
		service.wishlist = [];
	}

	service.addProduct = function (product, pokedex) {
		service.wishlist.push({ 'detail': product, 'pokedex': pokedex });
		localStorage.wishlist = JSON.stringify(service.wishlist);
	};

	service.updateList = function (list) {
		service.wishlist = list;
		localStorage.wishlist = JSON.stringify(service.wishlist);
	}

	return service;
});
