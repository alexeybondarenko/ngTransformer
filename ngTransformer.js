'use strict';

angular.module('ngTransformer', [])
.provider('$transform', [function() {

	return {
		__map: null,
		__model: null,
		setMap: function (newMapVal) {
			this.__map = newMapVal;
		},
		setModel: function (newModel) {
			this.__model = newModel;
		},
		getMap: function () {
			return this.__map;
		},
		$get: function () {
			return new Transfomer(this.__map, this.__model);
		}
	};
}]);

function Transfomer (map, model) {
	this.map = map;
	this.model = model;
}
Transfomer.prototype.map = null;
Transfomer.prototype.model = null;

Transfomer.prototype.parse = function (data) {

	var tmp = null,
		self = this,
		map = this.map,
		model = this.model;

	if (data.length) {
	    data = _.map(data, function(repo) {
	    	tmp = {};
	    	if (typeof map.parse === 'function') tmp = map.parse(repo);
	    	else {
		    	for (var prop in map) {
		    		// if (!map.hasOwnProperty(prop)) continue;
		    		tmp[prop] = repo[map[prop]];
		    	}
	    	}
	    	return (!model) ? tmp : new model(tmp); 
	    });
	} else {
		data = [];
	}

	return data;
};
Transfomer.prototype.serialize = function (data) {

	console.info("Transfomer serialize:", data);
	var result = [],
		tmp = null,
		map = this.map;

	if (data.length) {
		data.forEach(function (model) {
			if (typeof map.serialize === 'function') return map.serialize(model);
			tmp = {};
			for (var prop in map) {
				// if (!map.hasOwnProperty(prop)) continue;
				tmp[map[prop]] = model[prop];
			}
			result.push(tmp);
		});
	}
	
	return result;
};