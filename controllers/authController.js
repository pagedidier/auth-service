'use strict';

let passport = require('passport');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
var secret    = require(__dirname + '/../config/config.json')['secret'];
var tokenValideDuration    = require(__dirname + '/../config/config.json')['tokenValideDuration'];

var mongoose = require('mongoose');
let userModel = mongoose.model('Users');

exports.register = (req, res) => {
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
            res.status(201).json({error : true,data:err});
        res.status(201).json({error:false,data:user});
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
            const token = jwt.sign({_id:user._id,username:user.username},secret,{ expiresIn: tokenValideDuration });
            return res.status(200).json({token:token,data:user,error:false})
        });
    })
    (req, res);
};
