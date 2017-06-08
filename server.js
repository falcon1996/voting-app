var express = require('express');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;

var app = express();

var session = require('express-session');
app.use(session({secret: "customsessionsecret"}));
app.use(passport.initialize());
app.use(passport.session());


passport.use(new GithubStrategy({
    
    clientID: '',
    clientSecret: '',
    callbackURL: "https://voting-app-dhruvparashar.c9users.io/auth/github/callback"
    
},
function(accessToken, refreshToken, profile, done){
    
    return done(null,profile);
}
));


passport.serializeUser(function(user, done) {
    
    // placeholder for custom user serialization
    // null is for errors
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    
    // placeholder for custom user deserialization.
    // maybe you are going to get the user from mongo by id?
    // null is for errors
    done(null, user);
});


// we will call this to start the GitHub Login process
app.get('/auth/github', passport.authenticate('github'));


// GitHub will call this URL
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }),

    function(req, res) {
        
        res.redirect('/');
    }
);



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));


app.get('/', function(req,res){
    
    res.render('index.html');
    
    // dump the user for debugging
if (req.isAuthenticated()) {
    
    console.log('authenticated as user')
    console.log(JSON.stringify(req.user, null, 4));
}

})


app.get('/logout',function(req, res){
    
    console.log('logging out!');
    req.logout();
    res.redirect('/');
})





app.listen(8080, function(){
    console.log("Example of app listning on port 8080");
})