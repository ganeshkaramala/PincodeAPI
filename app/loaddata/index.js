var fs = require('fs'), 
DoublyLinkedList = require( __dirname + '/../datastructures/DoublyLinkedList.js');
QuickSort = require( __dirname + '/../datastructures/QuickSort.js');

function DataLoader() {
	this.loadPincodeData = function() {
		var doublyLinkedList = new DoublyLinkedList();
		var quickSort = new QuickSort();
		var filePath = __dirname + '/tgappol.csv';
		var content = fs.readFileSync(filePath, 'utf8', function(err, data) {
		});
		var contentArray = content.split('\r\n');
		var pincodeArray = [];
		contentArray.forEach(function(line) {
			var dataArray = line.split(",");
			var node = {
				pincode : dataArray[0],
				lat : dataArray[1],
				lng : dataArray[2]
			}
			pincodeArray.push(node);
		});
		pincodeArray = quickSort.sort(pincodeArray, 'lng');
		pincodeArray = quickSort.sort(pincodeArray, 'lat');
		pincodeArray.forEach(function(item){
			doublyLinkedList.add(item);
		});
		return doublyLinkedList;
	}
}

module.exports = DataLoader;
