'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MData = new Schema({
	
	ip: String,
	myname: String,
	password: String
});

module.exports = mongoose.model('Data', MData);
