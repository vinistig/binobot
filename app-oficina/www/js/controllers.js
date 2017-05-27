angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

})
.controller('FindCarroCtrl', function($scope, $timeout) {
	$scope.isLoading = true;
	
	$timeout(function() {
		$scope.isLoading = false;
	}, 2000);
	
  $scope.carros = [
    { nome: 'Fiat Uno Placa: FMV-1859', id: 1 },
    { nome: 'Vectra Placa: CVD-6854', id: 2 },
    { nome: 'Astra Placa: UID-0304', id: 3 }
  ];
})
.controller('AnalisarCarroCtrl', function($scope) {
  $scope.problemas = [
    { nome: 'Pneu careca', id: 1, pecaEnvolvida: "Pneu Aro 14\"", pecaComprada: "2", comprou: true },
    { nome: 'Óleo vencido', id: 2, pecaEnvolvida: "Óleo Vegetal 5000 KM", comprou: false},
    { nome: 'Pastilha de freio gasta', id: 3, pecaEnvolvida: "Pastilha Freio", comprou: false },
    { nome: 'Motor superaquecendo', id: 4, pecaEnvolvida: "Sem Sugestão", comprou: false }
  ];
})
.controller('ShopCtrl', function($scope, $http) {
	
	$scope.swiper = {};

    $scope.onReadySwiper = function (swiper) {

		swiper.on('slideChangeStart', function () {
			console.log('slide start');
		});
		
		swiper.on('onSlideChangeEnd', function () {
			console.log('slide end');
		});		
    };
	
	$scope.peca = "Óleo Vegetal 5000KM";
	$scope.vendedores = [
		{nome: "Auto Peças Bosh loja 5", src: "img/bosch_logo_portugese.png", distancia: "5 Km"},
		{nome: "Auto Peças DHL", src: "img/Dhl_logo_svg.png", distancia: "10 Km"},
		{nome: "Auto Peças Bosh loja 7", src: "img/bosch_logo_portugese.png", distancia: "35 Km"},
		{nome: "Auto Peças Mercedes", src: "img/mercedes-benz-logo-design.jpg", distancia: "25 Km"}
	];
	
	/*$http({
		method: 'GET',
		url: 'https://bizhack-9290c.firebaseio.com/data/pecas.json',
		params: ''
	}).success(function(data){
		$scope.vendedores = data;
	}).error(function(){
		alert("error");
	});*/
})