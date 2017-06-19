'use strict';
var util=require('util');
var querystring=require('querystring');
var bodyParser = require('body-parser');
var path = process.cwd();
var user = require('../models/users.js');
var data = require('../models/manual.js');



module.exports = function(app, passport){
    app.set('view engine', 'jade');
    app.use(bodyParser.urlencoded({ extended: false })); 
    
    var http = require('http').createServer(app);
    var io = require('socket.io')(http);
    
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
		
		
    app.route('/signin')                                        
        .get(function(req,res){
            res.sendFile(path+ '/public/signin.html');
        });
        
        
    app.route('/access')                                        
        .get(function(req,res){
            res.sendFile(path+ '/public/access.html');
        });
    
    
    app.route('/mypolls')                                        //new
        .get(function(req,res){
            
            user.find({ip:req.headers['x-forwarded-for']}, function(err,docs){
               if(err) res.json(err);
               
               else res.render("../views/mypolls.jade", {users:docs});     //results are stored in users
           });
            
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
        
        user.find({ip:req.headers['x-forwarded-for']}, function(err,doc){
            
            if(doc[0].question == req.params.topic){
                
                user.remove({question : req.params.topic},function(err){
            
                    if(err) res.json(err);
                    
                    else res.redirect('/view');
                });
            }
            
            else{
                
                console.log('You are not authorized to delete this poll!');
                console.log(doc);
            } 
            
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
            
            var ques = req.query.q;
            var off = req.query.offs;
            console.log(ques, off);
            
            if(off == 1){
                user.findOneAndUpdate({question:ques}, {$inc: {vote1 : 1}}, {new: true}, function(err,doc){
                   if(err) console.log('Error! while updating');
                   
                   else{
                       console.log('Updating successful!');
                       console.log(doc);
                       res.render("../views/chart.jade", {votes:doc});
                   } 
                });
            }
            if(off == 2){
                user.findOneAndUpdate({question:ques}, {$inc: {vote2 : 1}}, {new: true}, function(err,doc){
                   if(err) console.log('Error! while updating');
                   
                   else{
                       console.log('Updating successful!');
                       res.render("../views/chart.jade", {votes:doc});
                   }
                });
            }
            if(off == 3){
                user.findOneAndUpdate({question:ques}, {$inc: {vote3 : 1}}, {new: true}, function(err,doc){
                   if(err) console.log('Error! while updating');
                   
                   else{
                       console.log('Updating successful!');
                       res.render("../views/chart.jade", {votes:doc});
                   }
                });
            }
            if(off == 4){
                user.findOneAndUpdate({question:ques}, {$inc: {vote4 : 1}}, {new: true}, function(err,doc){
                   if(err) console.log('Error! while updating');
                   
                   else{
                       console.log('Updating successful!');
                       res.render("../views/chart.jade", {votes:doc});
                   }
                });
            }
            if(off == 5){
                user.findOneAndUpdate({question:ques}, {$inc: {vote5 : 1}}, {new: true}, function(err,doc){
                   if(err) console.log('Error! while updating');
                   
                   else{
                       console.log('Updating successful!');
                       res.render("../views/chart.jade", {votes:doc});
                   }
                });
            }
            
            
        });
    
    
    
    
    app.post('/new',function(req,res){
        
        new user({
            
            ip : req.headers['x-forwarded-for'],
            question : req.body.polltitle,
            option1 : req.body.input1,
            option2 : req.body.input2,
            option3 : req.body.input3,
            option4 : req.body.input4,
            option5 : req.body.input5,
            
        }).save(function(err,document){
            
            if(err) res.json(err);
            
            else res.redirect('/view');
        });
        
    });
    
    app.post('/data', function(req,res){
        
       data.find({myname:req.body.username},function(err,doc){
           
           if(err) res.json(err);
           
           else if(doc.length == 0){
               
               new data({
                   
                   ip : req.headers['x-forwarded-for'],
                   myname : req.body.username,
                   password : req.body.inputPassword
                   
               }).save(function(err,document){
                   
                   if(err) res.json(err);
                   
                   else{
                       console.log(document);
                       res.redirect('/login');
                   }
               });
           }
        
        else{
            
            console.log('Username already exists!');
            
            io.on('connection', function (socket){
                
                //socket.emit('news', {hello :'world!'});
                //socket.on('my other event', function (data) {
                    console.log('connected!!');
                //});

            });
        }    
       });
    });
    
    
    
    app.post('/inputauth',function(req, res){
        data.find({myname:req.body.username, password : req.body.inputPassword, ip : req.headers['x-forwarded-for']},function(err,doc){
                
            if(err) res.json(err);
                
            console.log('Successful login!!')
            res.redirect('/login')
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