'use strict';

var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var jade = require('jade');
var $ = require("jquery");

var routes = require('./app/routes/index.js');

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);


//mongoose.connect(process.env.MONGO_URI);
//mongoose.Promise = global.Promise;

app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public',express.static(__dirname + '/public'));


app.use(session({secret: "customsessionsecret", resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());



routes(app, passport);

app.listen(8080, function(){
    console.log("Example of app listning on port 8080");
})