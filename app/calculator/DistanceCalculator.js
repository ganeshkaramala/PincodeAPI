function DistanceCalculator() {
	var RM = 3961; // mean radius of the earth (miles) at 39 degrees from the equator
	var RKM = 6373; // mean radius of the earth (km) at 39 degrees from the equator
	this.distanceKm = function(t1, n1, t2, n2) {
		return round( RKM * distance(t1, n1, t2, n2));
	};
}

function distance(t1, n1, t2, n2) {
	var lat1, lon1, lat2, lon2, dlat, dlon, a, c;
	// convert coordinates to radian
	lat1 = degToRad(t1);
	lon1 = degToRad(n1);
	lat2 = degToRad(t2);
	lon2 = degToRad(n2);

	// find the differences between the coordinates
	dlat = lat2 - lat1;
	dlon = lon2 - lon1;

	// here's the heavy lifting
	a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2)
			* Math.pow(Math.sin(dlon / 2), 2);
	// great circle distance in radians
	c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return c;
}

function degToRad(deg) {
	return deg * Math.PI / 180;
	
}
function round(x) {
	return Math.round(x * 1000) / 1000;
}

module.exports = DistanceCalculator
