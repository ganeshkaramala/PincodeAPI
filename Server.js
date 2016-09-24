var reqexpress = require('express'), 
express = reqexpress(), // Web framework to handle routing requests
routes = require( __dirname + '/app/routes'), // Routes for our application
config = require(__dirname + '/config.json'), // for loading configuration file
http = require('request'),
dataLoader = require( __dirname + '/app/loaddata');


var app = {
	express : express,
	http: http,
	doublyLinkedList : new dataLoader().loadPincodeData()
}

// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || config.http.port;

//Application routes
routes(app);
express.listen(port);
console.log('Pincode REST API Server listening on port ' + port);
