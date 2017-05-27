angular.module('bizhack', [])
	.factory('bizhackApi', function($q, $http) {
	  return {
			categorias: function(dados) {
				var deferred = $q.defer();
				$http({
					url: "https://bizhack-9290c.firebaseio.com/data/categorias.json",
					method: "GET",
					params: dados
				}).then(function(response) {
					deferred.resolve(response);
				}, function() {
					deferred.reject("Error! @factory.CATEGORIAS");
				});
				return deferred.promise;
			},
			produtos: function(dados) {
				var deferred = $q.defer();
				$http({
					url: "https://bizhack-9290c.firebaseio.com/data/pecas.json",
					method: "GET",
					params: dados,
				}).then(function(response) {
				deferred.resolve(response);
				}, function() {
				deferred.reject("Error! @factory.PRODUTOS");
				});
				return deferred.promise;
			}
	  }
	})
	.controller("appCtrl", function($scope) {
	})
	.controller('homeCtrl', function($scope, $location, $rootScope, bizhackApi) {
			$scope.categorias = [];

			bizhackApi.categorias({}).then(function(response) {
				console.log('categorias loaded', response);
				$scope.categorias = response.data;
			});
	})
	.config(function($routeProvider) {
		$routeProvider
			.when("/", { templateUrl: "templates/home.html", controller: "home" })
			.when("/categoria", { templateUrl: "/templates/categoria.html", controller: "categoria" })
      .when("/about", { templateUrl: "/templates/about.html", controller: "about" })
    .otherwise({ redirectTo: '/' });
	})
	.run(function() {
	});