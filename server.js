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

app.get('/todasoficinas', function (req, res) {
    firebase.getTodasOficinas(function (result) {
        res.status(200).json(result);
    });
});

app.get('/guinchos', function (req, res) {
    firebase.getAllGuinchos(function (result) {
        res.status(200).json(result);
    });
});

app.get('/servicos/:id', function (req, res) {
    firebase.getOficinaByServicoId(req.params.id, function (result) {
        res.status(200).json(result);
    });
});

app.get('/proximas/:lat/:long/:max', function (req, res) {
    var me = [parseFloat(req.params.lat), parseFloat(req.params.long)];
    var max = parseFloat(req.params.max);
    var response;
    firebase.getOficinasProximasPorLocalizacao(me, max, function (result) {
        res.status(200).json(result);
    });
});

server.listen(app.get('port'));