var PincodeHandler = require( __dirname + '/../handler/PincodeHandler');
	
function Route(app) {
	
    var express = app.express;
    var pincodeHandler = new PincodeHandler(app);

    express.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers",
				"Origin, X-Requested-With, Content-Type, Accept");
		next();
	});

    express.get("/v1/pinocde/:pincode/info", pincodeHandler.getPinodeInfo);
    express.get("/v1/pinocde/:pincode/geocode", pincodeHandler.getGeocode);
    express.get("/v1/pinocde/:pincode/distance", pincodeHandler.getDistances);
    express.get("*", pincodeHandler.information);
}

module.exports = Route