'use strict';

let bcrypt = require('bcryptjs');

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
            res.send({error : true,data:err});
        res.json({error:false,data:user});
    });
};
