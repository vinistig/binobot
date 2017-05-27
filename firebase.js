var admin = require('firebase-admin');
var GeoFire = require('geofire');

// Fetch the service account key JSON file contents
var serviceAccount = require('./bizhack-firebase.json');

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://bizhack-9290c.firebaseio.com'
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var rootGeoRef = db.ref('geo');
var rootRef = db.ref('data/item');

var geoFire = new GeoFire(rootGeoRef);
var geoRef = geoFire.ref();

module.exports = {

    getTodasOficinas: function (cb) {
        var response = [];
        rootRef.once('value', function (snap) {
            snap.forEach(function (childSnap) {
                var key = childSnap.val();
                var nome = key['nome'];
                if (response.length <= 5) {
                    response.push(nome);
                }
            });
            if (cb) cb(response);
        });
    },

    setGeoFireDatabase: function () {
        rootRef.once('value', function (snap) {
            snap.forEach(function (childSnap) {
                var key = childSnap.val();
                // remove chars . # $ ] [ /
                var newNames = key['nome'].replace(/\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:|\s/g, '');
                var names = newNames.split(' ').join('_');
                geoFire.set({
                    [names]: [parseFloat(key['Latitude']), parseFloat(key['Longitude'])]
                }).then(function () {
                    console.log('Provided key has been added to GeoFire');
                });
            });
        });
    },

    getAllGeoFire: function (cb) {
        rootGeoRef.once('value', function (snap) {
            snap.forEach(function (childSnap) {
                var key = childSnap.key;
                geoFire.get(key).then(function (location) {
                    if (location === null) {
                        console.log('Provided key is not in GeoFire');
                    } else {
                        /*console.log(location);*/
                        if (cb) cb(location);
                    }
                }, function (error) {
                    console.log('Error: ' + error);
                });
            });
        });
    },

    getAllGuinchos: function (cb) {
        var guinchoArray = [];
        rootRef.once('value', function (snap) {
            snap.forEach(function (childSnap) {
                var key = childSnap.val();
                if (key['guincho'] == 1) {
                    guinchoArray.push(key);
                }
            });
            /*console.log('Tem guincho: ', guinchoArray);*/
            if (cb) cb(guinchoArray);
        });
    },

    getOficinaByServicoId: function (id, cb) {
        var oficinasArray = [];
        rootRef.once('value', function (snap) {
            snap.forEach(function (childSnap) {
                var key = childSnap.val();
                if (key['servicos']) {
                    if (key['servicos'].includes(id.toString())) {
                        oficinasArray.push(key);
                    }
                }
            });
            if (cb) cb(oficinasArray);
            /*console.log('Tem o servico: ', oficinasArray);*/
        });
    },

    getOficinasProximasPorLocalizacao: function (minhaLocalizacao, maxDistancia, cb) {
          // minhaLocalizacao, array com [l, g];
          // maxDistancia em KM
          rootGeoRef.once('value', function (snap) {
             // cria task
             var count1 = 0;
             var count2 = 0;
             var oficinasPerto = [];
             var taskGetDistance = function (key, localizacaoDasOficinas, resultGetDistance) {
                 var distanceInKm = GeoFire.distance(minhaLocalizacao, localizacaoDasOficinas);
                if (distanceInKm <= maxDistancia) {
                     oficinasPerto.push(key);
                 }
                 // resulta task
                 resultGetDistance(oficinasPerto);
             }
             snap.forEach(function (childSnap) {
                 var key = childSnap.key;
                 count1++;
                 geoFire.get(key).then(function (localizacaoDasOficinas) {
                     if (localizacaoDasOficinas === null) {
                         console.log('Provided key is not in GeoFire');
                     } else {
                         // executa task
                         taskGetDistance(key, localizacaoDasOficinas, function (oficinasPerto) {
                             count2++;
                             if (count1 == count2) {
                                 if (cb) cb(oficinasPerto);
                             }
                         });
                     }
                 }, function (error) {
                     console.log('Error: ' + error);
                 });
             });
         });
     },

    getDistanceBetweenTwoPoints: function (location1, location2) {
        var distanceInKm = GeoFire.distance(location1, location2);
        return distanceInKm;
    },





};