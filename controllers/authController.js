'use strict';

let passport = require('passport');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
var secret    = require(__dirname + '/../config/config.json')['secret'];
var tokenValideDuration    = require(__dirname + '/../config/config.json')['tokenValideDuration'];

var mongoose = require('mongoose');
let userModel = mongoose.model('Users');

exports.register = (req, res) => {

    if(req.body.username === undefined || req.body.password === undefined)
        return res.status(400).json({error:true,message:"You should provide a username and a password",data:null});
    const {
        username,
        password,
    } = req.body;
    let hashedPassword = bcrypt.hashSync(password, 8);
    var user = new userModel({
        username: username,
        password: hashedPassword
    });
    user.save(function(err, user) {
        if (err)
            return res.status(201).json({error : true,message: 'Error while register ',data:err});
        return res.status(201).json({error:false,message:'Successfully register',data:user});

    });
};


exports.login = (req,res)=>{
    passport.authenticate('local', {session: false}, (err, user, info) => {

        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                data   : user,
                error: true
            });
        }

        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }
            user.set('password');
            const token = jwt.sign({_id:user._id,username:user.username},secret,{ expiresIn: tokenValideDuration,issuer:'localhost'});
            return res.status(200).json({token:token,data:user,message:'Successfully logged in',error:false})
        });
    })
    (req, res);
};
