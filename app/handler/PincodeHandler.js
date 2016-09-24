var DistanceCalculator = require(__dirname
		+ '/../calculator/DistanceCalculator.js');

var QuickSort = require(__dirname + '/../datastructures/QuickSort.js')

function PincodeHandler(app) {
	var me = this;
	var distanceCalculator = new DistanceCalculator();
	var quickSort = new QuickSort();
	me.information = function(req, res, next) {
		res.sendFile(__dirname + '/index.html');
	};
	me.getPinodeInfo = function(req, res, next) {

		var uri = 'https://data.gov.in/api/datastore/resource.json?resource_id=04cbe4b1-2f2b-4c39-a1d5-1c2e28bc0e32&api-key=30978ece072b9bba2176fe1921134a1f&filters[pincode]='
				+ req.params.pincode
				+ '&fields=officename,Taluk,divisionname,statename';
		app.http(uri, function(error, response, body) {
			var data;
			if (error) {
				res.json({
					"error" : error
				});
				return;
			}
			data = JSON.parse(body);
			var responseData = {
				"pinocde" : req.params.pincode,
				"Post Offices" : data.records
			}
			res.json(responseData);
		});
	};
	me.getGeocode = function(req, res, next) {
		var responseData = me.getPinGeocode(req.params.pincode);
		if (!responseData.geocode)
			responseData.geocode = 'Not found'
		res.json(responseData);
	};
	me.getPinGeocode = function(pincode) {
		var node = me.searchPin(pincode);
		if (node != -1) {
			node = node.data;
			var data = {
				'pincode' : node['pincode'],
				'geocode' : {
					'lat' : node['lat'],
					'lng' : node['lng']
				}
			};
			return data;
		} else {
			return {
				'pincode' : pincode,
				'geocode' : null
			};
		}
	};
	me.searchPin = function(pincode) {
		return app.doublyLinkedList.search('pincode', pincode);
	};
	me.getDistances = function(req, res, next) {
		var maxDistance = req.query.distance || 100;
		if(maxDistance >=6373){
			maxDistance = 6373;
		}
		var limit = req.query.limit || 100
		if(limit >= 200000){
			limit = 200000;
		}
		var sourepincode = req.params.pincode;
		var node = me.searchPin(sourepincode);
		if (node == -1) {
			var data = {
				'pincode' : sourepincode,
				'result' : 'Pin code not found'
			};
			res.json(data);
			return
		}
		var source = node;
		var nDistance, pDistance, next, prev;
		var distanceArray = [];
		var calculateNext = true;
		var calculatePrev = true;
		var oneDegreeLatDistance = 111.23;
		var oneDegreeLngDistance = 86.565;
		var latDiff,lngDiff;
		var next = node.next;
		var prev = node.prev;
		var searchedItems = 0;
		var iterationCount = 0;
		while (calculateNext && calculatePrev && (next || prev )) {
			iterationCount ++;
			if( distanceArray.length == limit){
				break;
			}
			if (calculateNext && next && next.data ) {
				nDistance = distanceCalculator.distanceKm(source.data.lat, source.data.lng,
						next.data.lat, next.data.lng);
				latDiff = next.data.lat - source.data.lat;
				lngDiff = next.data.lng - source.data.lng;
				if ((nDistance > maxDistance) && ( (latDiff * oneDegreeLatDistance) > maxDistance) && ((lngDiff * oneDegreeLngDistance)>maxDistance) ){
					calculateNext = false;
					nDistance = 0;
				}else if ( nDistance < maxDistance && distanceArray.length < limit ){
					distanceArray.push({
						'pincode': next.data.pincode,
						'straight-distance': nDistance
					});
				}
				next = next.next;
				searchedItems ++;
			}
			if (calculatePrev && prev && prev.data) {
				pDistance = distanceCalculator.distanceKm(source.data.lat, source.data.lng,
						prev.data.lat, prev.data.lng);
				latDiff = source.data.lat - prev.data.lat;
				lngDiff = source.data.lng - prev.data.lng;
				if (pDistance > maxDistance && ( (latDiff * oneDegreeLatDistance) > maxDistance) && ((lngDiff * oneDegreeLngDistance)>maxDistance)){
					calculatePrev = false;
					pDistance = 0;
				}
				else if ( pDistance < maxDistance && distanceArray.length < limit) {
					distanceArray.push({
						'pincode': prev.data.pincode,
						'straight-distance': pDistance
					});
				}
				prev = prev.prev;
				searchedItems ++;
			}
		}
		console.log('Iterations = '+iterationCount+' Items searched = '+searchedItems+',result size = '+distanceArray.length)
		res.json(quickSort.sort(distanceArray,'straight-distance'));
	}
}

module.exports = PincodeHandler