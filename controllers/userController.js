'use strict';

var mongoose = require('mongoose');
let bcrypt = require('bcryptjs');

let UserController = mongoose.model('Users');


exports.userAdd = function(req, res) {
    const {
        username,
        password,
    } = req.body;

    let hashedPassword = bcrypt.hashSync(password, 8);
    console.log(hashedPassword);
    var user = new UserController({
        username: username,
        password: hashedPassword
    });
    user.save(function(err, user) {
        if (err)
            res.send(err);
        res.json(user);
    });
};
