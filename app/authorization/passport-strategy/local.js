var LocalStrategy   = require('passport-local').Strategy;
var User  = require('../models/UserModel.js');
var jwt        = require("jsonwebtoken");

var config = require('../../../config/config');
var fs = require('fs');
var cert = fs.readFileSync('key.pem');
exports.signupStrategy = new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true 
},
                                           function(req, email, password, done) {
    process.nextTick(function() {
        User.findOne({ 'local.email' :  email }, function(err, user) {
            if (err){
                return done(err);
            }
            if (user) {
                return done(null, {type : false,err: 'Email is already taken.',data:''});
            } else {
                var newUser  = new User();
                newUser.role =  'user';
                newUser.local.email = email;
                newUser.local.password = newUser.generateHash(password);
                newUser.save(function(err,user) {
                    if (err){
                        return done(null,{
                            type:false,
                            data: 'error occured '+ err
                        });
                    }

                    var token = jwt.sign({email: user.local.email, role : user.role}, cert, { algorithm: 'HS512'});             

        return done(null, {type : true, 'data' : token,'err':''});
                });   
            }
        });    
    });
});

exports.loginStrategy = new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true 
},
                                          function(req, email, password, done) {
    process.nextTick(function() {
        var mUser = new User();
        User.findOne({'local.email': email}, function(err, user) {
            if (err){
                return done(null,{type:false,err: 'error occured '+ err,data:''});
            }
            if (!user) {
                return done(null, {type: false, 'err': "Account doesn't exists with the email provided.",'data':''});
            } 
            if(!user.validPassword(password)){
                return done(null, {type: false, 'err': 'Password is wrong.','data':''}); 
            }
            
            var token = jwt.sign({email: user.local.email, role : user.role}, cert, { algorithm: 'HS512'});          
            
            return done(null, {type : true, 'data' : token,'err':''});
        });    
    });
});


