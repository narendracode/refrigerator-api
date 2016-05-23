var passport = require('passport');
var User  = require('../models/UserModel.js');


exports.deleteUser = function(req,res,next){
    User.remove({"local.email" : req.body.email},function(err){
        if(err)
            res.json({type:false,err: 'error occured '+ err,'data':''});

        res.json({type:true,data: 'user deleted successfully with email '+ req.body.email,err:''});
    });
}

exports.localSignup =  function(req, res, next){  
    passport.authenticate('local-signup',function(err, user, info){
        if (err) { 
            return res.json({type:false,err: 'error occured '+ err,'data':''}); 
        }
        return res.json(user);
    })(req, res, next);
}

function urlBase64Decode(str) {
    var output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
        case 0:
            break;
        case 2:
            output += '==';
            break;
        case 3:
            output += '=';
            break;
        default:
            throw 'Illegal base64url string!';
    }
    return window.atob(output);
}

function parseToken(token){
    var user = {};
    if(token){
        var encoded = token.split('.')[1];
        user = JSON.parse(urlBase64Decode(encoded));
    }
    return user;  
}

exports.localLogin = function(req, res, next){
    passport.authenticate('local-login',function(err, user, info){
        if (err) { 
            return res.json({type:false,err: 'error occured '+ err,'data':''}); 
        }
        if(user){
            return res.json(user);
        }
    })(req, res, next);
}

exports.logout = function(req, res) {
    if(req.user) {
        req.session.destroy();
        req.logout();
        res.json({'status':200,'message':'User successfully logged out.','role':'none',type:false});
    } else {
        res.json({'status':200,'message':'User successfully logged out','role':'none', type: false});
    }
};
