function QuickSort() {
	this.sort = function(array, key, order) {
		order = order ? order == 'desc' ? -1 : 1 : 1
		var sortedArray = array.sort(function(a, b) {
			if (a[key] < b[key]) {
				return -(order);
			}
			if (a[key] > b[key]) {
				return order;
			}
			return 0;
		});
		return sortedArray;
	}
}

module.exports = QuickSort