var PincodeHandler = require('./PincodeHandler');
	
var pincodeHandler = new PincodeHandler();
function Route(app) {

	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers",
				"Origin, X-Requested-With, Content-Type, Accept");
		next();
	});

	app.get("/v1/pinocde", pincodeHandler.sayHello);
}

module.exports = Route