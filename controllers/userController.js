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
            res.send({error : true,data:err});
        res.json({error:false,data:user});
    });
};

exports.userGet = function(req, res) {
    userModel.findById(req.params.id, function(err, user) {
        if (err)
            res.send({error:true,data:err});
        res.json({data: user,error:false});
    });
};
exports.userDelete = function(req, res) {


    userModel.deleteOne({
        _id: req.params.id
    }, function(err, user) {
        if (err)
            res.send(err);
        res.status(201).json({
            error:false,
            message: "User deleted"
        });
    });
};

