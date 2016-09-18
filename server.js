var express = require('express'), 
app = express(), // Web framework to handle routing requests
routes = require(__dirname + '/routes'), // Routes for our application
config = require(__dirname + '/config.json'); // for loading configuration file


// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || config.http.port;

//Application routes
routes(app);
app.listen(port);
console.log('Pincode REST API Server listening on port ' + port);
