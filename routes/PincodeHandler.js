function PincodeHandler(http){
	var me = this;
	me.sayHello = function(req,res,next){
		res.json({'message':'Hello !! Welcome to Pincode REST API ... '});
	}
	
	me.getPinodeInfo = function(req,res,next){
		
		var uri = 'https://data.gov.in/api/datastore/resource.json?resource_id=04cbe4b1-2f2b-4c39-a1d5-1c2e28bc0e32&api-key=30978ece072b9bba2176fe1921134a1f&filters[pincode]='+req.params.pincode+'&fields=officename,Taluk,divisionname,statename,pincode';

		http(uri, function (error, response, body) {
			var data;
			if( error ) 
				res.json({"error":error});
			data = JSON.parse(body);
			res.json(data.records);
		});
	}
}

module.exports = PincodeHandler