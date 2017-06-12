'use strict';
var util=require('util');
var querystring=require('querystring');
var path = process.cwd();
var user = require('../models/users.js');

module.exports = function(app, passport){
    
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
    
    app.get('/edit', function(req,res){
        
       res.render('edit-form');
    });
    
    
    
    app.post('/new',function(req,res){
        //res.sendFile(path+ '/public/success.html');
        //res.render('some-file', { name: req.body.name });
        
        new user({
            
            question : req.body.polltitle,
            option1 : req.body.input1,
            option2 : req.body.input2,
            option3 : req.body.input3,
            option4 : req.body.input4,
            option5 : req.body.input5
        }).save(function(err,document){
            
            if(err) res.json(err);
            
            else res.send('Successfully Inserted!');
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