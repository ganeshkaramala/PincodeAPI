var PincodeHandler = require('./PincodeHandler');
	
function Route(app) {
	
    var express = app.express;
    var pincodeHandler = new PincodeHandler(app.http);

    express.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers",
				"Origin, X-Requested-With, Content-Type, Accept");
		next();
	});

    express.get("/v1/pinocde", pincodeHandler.sayHello);
    express.get("/v1/pinocde/info/:pincode", pincodeHandler.getPinodeInfo);
}

module.exports = Route