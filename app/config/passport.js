var GitHubStrategy = require('passport-github').Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function(passport){
    
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
    
    
    
    passport.use(new GitHubStrategy({
    
    clientID: configAuth.githubAuth.clientID,
    clientSecret: configAuth.githubAuth.clientSecret,
    callbackURL: configAuth.githubAuth.callbackURL
    
    },
    function(accessToken, refreshToken, profile, done){
        
        
        return done(null, profile);

    }));

};