var firebase = require('./firebase');
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 3000;
var server = http.createServer(app);

app.set('port', port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
/*
firebase.getTodasOficinas().then(function (snap) {
    console.log(snap.val());
});*/

/*var distance = firebase.getDistanceBetweenTwoPoints([-22, -45], [-23, -46]);*/

/*firebase.getOficinasProximasPorLocalizacao([-22, -45], 15);*/

/*firebase.getTodasOficinas(function(result) {
    console.log(result);
});*/

/*firebase.getAllGeoFire(function(result) {
    console.log(result);
});*/

/*firebase.getAllGuinchos(function (result) {
    console.log(result);
});*/

/*firebase.getOficinaByServicoId(4133, function(result) {
    console.log(result);
});*/

firebase.getOficinasProximasPorLocalizacao([-22, -45], 400, function (result) {
    console.log(result);
});

server.listen(app.get('port'));