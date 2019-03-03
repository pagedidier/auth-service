'use strict';

var mongoose = require('mongoose');
let bcrypt = require('bcryptjs');

let userModel = mongoose.model('Users');


exports.userAdd = function(req, res) {
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
            return res.json({error : true, data:err});
        return res.status(201).json({error:false,data:user,message:'User created'});
    });
};

exports.userGet = function(req, res) {
    userModel.findById(req.params.id, function(err, user) {
        if (err)
            return res.json({error:true,data:err});
        if(req.decoded._id === user._id.toString())
            return res.json({data: user,error:false});
        return res.status(403).json({error:true,message:'Access dined'});
    });
};
exports.userDelete = function(req, res) {
    userModel.deleteOne({
        _id: req.params.id
    }, function(err, user) {
        if (err)
            return res.json({data: err,error:true});
        return res.status(201).json({
            error:false,
            message: "User deleted"
        });
    });
};

