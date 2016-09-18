function PincodeHandler(){
	this.sayHello = function(req,res,next){
		res.send("Hello !! Welcome to Pincode REST API ... ");
	}
}

module.exports = PincodeHandler