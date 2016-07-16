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
		url:'/detail/:pokemon',
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

}]);

myApp.controller('PokedexCtrl', ['$scope', '$http', '$filter', function($scope, $http, $filter){
  
}]);

myApp.controller('ItemsCtrl', ['$scope', '$http', '$filter', function($scope, $http, $filter) {

}]);

myApp.controller('DetailCtrl', ['$scope', '$http', '$filter', function($scope, $http, $filter) {

}]);

myApp.controller('WishlistCtrl', ['$scope', '$http', '$filter', function($scope, $http, $filter) {

}]);