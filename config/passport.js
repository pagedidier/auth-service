const LocalStrategy = require('passport-local').Strategy;
let userModel = require("../models/userModel");
let passport = require('passport');
let bcrypt = require('bcryptjs');


passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    function (username, password, cb) {
        return userModel.findOne({
            username:username
        }).then(user => {
                if(user){
                    if(!bcrypt.compareSync(password,user.password)){
                        return cb(null, false, {message: 'Incorrect email or password.'});
                    }else{
                        delete user['password'];
                        return cb(null, user, {
                            message: 'Logged In Successfully'
                        });
                    }
                }else{
                    return cb(null, false, {message: 'Incorrect email or password.'});

                }
            })
            .catch(err => {
                console.log(err);
                return cb(err);
            });
    }
));
