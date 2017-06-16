'use strict';
var util=require('util');
var querystring=require('querystring');
var bodyParser = require('body-parser');
var path = process.cwd();
var user = require('../models/users.js');
var vote = require('../models/votes.js');


module.exports = function(app, passport){
    app.set('view engine', 'jade');
    app.use(bodyParser.urlencoded({ extended: false })); 
    
    function isLoggedIn(req,res,next){
        
        if(req.isAuthenticated()){
            return next();
        }
        else{
            //res.redirect('/');
            //return next()
            console.log('not authenticated');
        }
    }
    
    
    app.route('/')
		.get( function (req, res) {
			res.sendFile(path + '/public/index.html');
		});
		
		
    
    app.route('/logout')
        .get(function(req, res){
            console.log('Logging Out!');
            req.logout();
            res.redirect('/');
        });
    
    
    app.route('/login')
        .get(function(req,res){
            res.sendFile(path+ '/public/login.html');
        });
    
    
    app.get('/view', function(req,res){
        
       user.find({}, function(err,docs){
           
           if(err) res.json(err);
           
           else res.render("../views/info.jade", {users:docs});     //results are stored in users
           
       });
    });
    
    
    app.get('/user/:topic/delete',function(req,res){
        
        user.remove({question : req.params.topic},function(err){
            
            if(err) res.json(err);
            
            else res.redirect('/view');
            
        });
    });
    
    
    app.get('/user/:topic', function(req, res){
        
        user.find({question : req.params.topic},function(err, docs){
            if(err) res.json(err);
            
            else res.render("../views/show.jade", {user:docs[0]});  //passing results to a variable called user
        });
        
    });
    
    
    app.route('/option')
        .get(function(req, res){
            console.log('Working');
            var ques = req.query.q;
            var choice = req.query.opt
            console.log(ques, choice);
            res.redirect('/view');
        });
    
    
    
    
    
    app.post('/new',function(req,res){
        
    /*    new vote({
            
            question : req.body.polltitle,
            option1 : 0,
        	option2 : 0,
            option3 : 0,
        	option4 : 0,
        	option5 : 0
        }).save(function(err,doc){
            
            if(err) res.json(err);
        });*/
        
        
        new user({
            
            question : req.body.polltitle,
            option1 : req.body.input1,
            option2 : req.body.input2,
            option3 : req.body.input3,
            option4 : req.body.input4,
            option5 : req.body.input5
        }).save(function(err,document){
            
            if(err) res.json(err);
            
            else res.redirect('/view');
        });
        
    });
    
    
    
    
    
    // we will call this to start the GitHub Login process
    app.get('/auth/github',passport.authenticate('github'));
    
    // GitHub will call this URL
    app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
      function(req, res) {
        res.redirect('/login');
      }
    );
    
    
    
};