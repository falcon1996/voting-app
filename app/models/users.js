'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	
	question: String,
	option1: String, vote : Number,
	option2: String,
    option3: String,
	option4: String,
	option5: String,
	vote1: { type: Number, default: 0 },
	vote2: { type: Number, default: 0 },
	vote3: { type: Number, default: 0 },
	vote4: { type: Number, default: 0 },
	vote5: { type: Number, default: 0 },
	voted: { type: Boolean, default: false}
	
});

module.exports = mongoose.model('User', User);
