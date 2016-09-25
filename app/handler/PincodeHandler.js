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
		var pincode = req.params.pincode;
		var id = req.query.id || 1;
		var responseData = me.getPinGeocode(pincode,id);
		if (!responseData.geocode){
			responseData = me.getPinGeocode(pincode,1);
			if(!responseData.geocode){
				responseData.geocode = 'Not found'
			}
		}
		res.json(responseData);
	};
	me.getPinGeocode = function(pincode,id) {
		var node = me.searchPin(pincode,id);
		if (node != -1) {
			node = node.data;
			var data = {
				'pincode' : node['pincode'],
				'id'      : node['id'],
				'name'	  : node['name'],
				'taluk'	  : node['taluk'],
				'district': node['district'],
				'state'   : node['state'],
				'geocode' :{
					'lat' 	  : node['lat'],
					'lng'     : node['lng']
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
	me.searchPin = function(pincode,id,orderBy) {
		if( orderBy == 'pincode' ){
			return app.doublyLinkedList.orderByPin.search('pincode', pincode,'id',id);
		}
		return app.doublyLinkedList.orderByCoordinates.search('pincode', pincode,'id',id);
	};
	me.getDistances = function(req, res, next) {
		var queryParams = getDistanceQueryParams(req);
		var pincodeData  = validatePincode(queryParams,me,res);
		var source = me.searchPin(pincodeData.pincode,pincodeData.id);
		var destination = findDestinations(source,queryParams,distanceCalculator);
	    quickSort.sort(destination,'straight-distance',queryParams.orderBy);
	    var finalDestination = [];
	    for (var i = 0,len= destination.length; i < len; i++) {
	    	finalDestination.push(destination[i]);
	    	if( finalDestination.length > queryParams.limit  ){
	    		break;
	    	}
	    }
	    pincodeData['destination-size'] = finalDestination.length;
		var responseData = {
				'source' :pincodeData,
				'destination':finalDestination
		};
		res.json(responseData);
	}
}

function getDistanceQueryParams(req){
	var radius = req.query.radius || 100;
	var limit = req.query.limit || 100;
	var nearBy = req.query.nearBy;
	if(['district','subregion','region'].indexOf(nearBy) == -1 ) {
		nearBy = null;	
	}
	var queryParams = {
		pincode : req.params.pincode,
		id      : req.params.id || 1,
		radius	: radius >= 6373 ? 6373 : radius,
		limit	: limit >= 200000 ? 200000 : limit,
		nearBy  : nearBy,
		orderBy : req.query.orderBy || 'ASC'
	}
	return queryParams;
}
function validatePincode(queryParams,me,res){
	var node = me.getPinGeocode(queryParams.pincode,queryParams.id);
	if (!node.geocode){
		node = me.getPinGeocode(queryParams.pincode,1);
		if(!node.geocode){
			var data = {
					'pincode' : queryParams.pincode,
					'result' : 'Pin code not found'
			    };
			res.json(data);
			return
		}
	}
	return node;
}
function findDestinations(source,queryParams,distanceCalculator){
	var nDistance, pDistance,latDiff,lngDiff,next = source.next,prev = source.prev,maxDistance = queryParams.radius;
	var nearBy = queryParams.nearBy ? false : true ;
	var pincodeRange = [];
	if(!nearBy){
		switch(queryParams.nearBy){
		  case 'district' :
			  var num =  queryParams.pincode.substring(0,3);
			  num = num-1;
			  pincodeRange.push(num);
			  pincodeRange.push(num+2);
			  break;
		  case 'subregion':
			  var num =  queryParams.pincode.substring(0,2);
			  num = num-1;
			  pincodeRange.push(num);
			  pincodeRange.push(num+2);
			  break;
		  case 'region':
			  var num =  queryParams.pincode.substring(0,1);
			  num = num-1;
			  pincodeRange.push(num);
			  pincodeRange.push(num+2);
			  break;
		}
	}
	var pincodeRangeLength = pincodeRange.length;
	var distanceArray = [];
	var calculateNext = true;
	var calculatePrev = true;
	var oneDegreeLatDistance = 111.23;
	var oneDegreeLngDistance = 86.565;
	var searchedItems = 0;
	var iterationCount = 0;
	while (calculateNext && calculatePrev && (next || prev )) {
		iterationCount ++;
		var nsubpin,psubpin;
		if (calculateNext && next && next.data ) {
			switch(queryParams.nearBy){
			  case 'district' :
				  nsubpin = next.data.pincode.substring(0,3);
				  break;
			  case 'subregion':
				  nsubpin = next.data.pincode.substring(0,2);
				  break;
			  case 'region':
				  nsubpin = next.data.pincode.substring(0,1);
				  break;
			}
			if( pincodeRangeLength && (nsubpin <= pincodeRange[0] || nsubpin>=pincodeRange[1] )){
				next = next.next;
			}
			else{
				nDistance = distanceCalculator.distanceKm(source.data.lat, source.data.lng,
						next.data.lat, next.data.lng);
				latDiff = next.data.lat - source.data.lat;
				lngDiff = next.data.lng - source.data.lng;
				if ((nDistance > maxDistance) && ( (latDiff * oneDegreeLatDistance) > maxDistance) && ((lngDiff * oneDegreeLngDistance) > maxDistance) ){
					calculateNext = false;
					nDistance = 0;
				}else if ( nDistance < maxDistance  ){
					next.data['straight-distance'] =  nDistance;
					distanceArray.push(next.data);
				}
				next = next.next;
			}
			searchedItems ++;
		}
		if (calculatePrev && prev && prev.data) {
			switch(queryParams.nearBy){
			  case 'district' :
				  psubpin = prev.data.pincode.substring(0,3);
				  break;
			  case 'subregion':
				  psubpin = prev.data.pincode.substring(0,2);
				  break;
			  case 'region':
				  psubpin = prev.data.pincode.substring(0,1);
				  break;
			}
			if( pincodeRangeLength && (psubpin<=pincodeRange[0] || psubpin>=pincodeRange[1] )){
				prev = prev.prev;
			}
			else{
				pDistance = distanceCalculator.distanceKm(source.data.lat, source.data.lng,
						prev.data.lat, prev.data.lng);
				latDiff = source.data.lat - prev.data.lat;
				lngDiff = source.data.lng - prev.data.lng;
				if (pDistance > maxDistance && ( (latDiff * oneDegreeLatDistance) > maxDistance) && ((lngDiff * oneDegreeLngDistance)>maxDistance) ){
					calculatePrev = false;
					pDistance = 0;
				}
				else if ( pDistance < maxDistance) {
					prev.data['straight-distance']  =  pDistance;
					distanceArray.push(prev.data);
				}
				prev = prev.prev;
			}
			searchedItems ++;
		}
	}
	console.log('Iterations = '+iterationCount+' Items searched = '+searchedItems+' Result size = '+distanceArray.length);
	return distanceArray;
}
module.exports = PincodeHandler