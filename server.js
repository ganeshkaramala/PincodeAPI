var reqexpress = require('express'), 
express = reqexpress(), // Web framework to handle routing requests
routes = require( __dirname + '/app/routes'), // Routes for our application
config = require(__dirname + '/config.json'), // for loading configuration file
http = require('request'),
dataLoader = require( __dirname + '/app/loaddata'),
DoublyLinkedList = require( __dirname + '/app/datastructures/DoublyLinkedList.js');
QuickSort = require( __dirname + '/app/datastructures/QuickSort.js');


var doublyLinkedListOrderByPin = new DoublyLinkedList();
var doublyLinkedListOrderByCoordinates = new DoublyLinkedList();
var quickSort = new QuickSort();

var pincodeArray  =  new dataLoader().loadPincodeData();
pincodeArray = quickSort.sort(pincodeArray, 'lng');
pincodeArray = quickSort.sort(pincodeArray, 'lat');
pincodeArray.forEach(function(item){
	doublyLinkedListOrderByCoordinates.add(item);
});


pincodeArray = quickSort.sort(pincodeArray, 'pincode');
pincodeArray.forEach(function(item){
	doublyLinkedListOrderByPin.add(item);
});

var app = {
	express : express,
	http: http,
	doublyLinkedList : {
		orderByPin:doublyLinkedListOrderByPin,
		orderByCoordinates:doublyLinkedListOrderByCoordinates
	}
}
console.log(app.doublyLinkedList.orderByCoordinates.length);

// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || config.http.port;

//Application routes
routes(app);
express.listen(port);
console.log('Pincode REST API Server listening on port ' + port);
