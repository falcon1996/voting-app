'use strict';

var path = process.cwd();

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
        
       res.render('edit-form') 
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