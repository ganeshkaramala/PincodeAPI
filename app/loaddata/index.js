var fs = require('fs');

function DataLoader() {
	this.loadPincodeData = function() {
		var filePath = __dirname + '/inpo.csv';
		var content = fs.readFileSync(filePath, 'utf8', function(err, data) {
		});
		var contentArray = content.split('\r\n');
		var pincodeArray = [];
		contentArray.forEach(function(line) {
			var dataArray = line.split(",");
			var node = {
				pincode : dataArray[0],
				lat     : dataArray[1],
				lng 	: dataArray[2],
				id		: dataArray[3],
				name    : dataArray[4],
				state   : dataArray[5],
				district: dataArray[6],
				taluk	: dataArray[7]
			}
			pincodeArray.push(node);
		});
		return pincodeArray;
	}
}

module.exports = DataLoader;
