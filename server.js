var reqexpress = require('express'), 
express = reqexpress(), // Web framework to handle routing requests
routes = require(__dirname + '/routes'), // Routes for our application
config = require(__dirname + '/config.json'), // for loading configuration file
http = require('request');

var app = {
	express : express,
	http: http
}

// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || config.http.port;

//Application routes
routes(app);
express.listen(port);
console.log('Pincode REST API Server listening on port ' + port);
