'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Vote = new Schema({
	
	option1: Number,
	option2: Number,
    option3: Number,
	option4: Number,
	option5: Number
	
});

module.exports = mongoose.model('Vote', Vote);
