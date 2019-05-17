const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');


passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
},
((username, password, cb) => userModel.findOne({
  username,
}).then((user) => {
  if (user) {
    if (!bcrypt.compareSync(password, user.password)) {
      return cb(null, false, { message: 'Incorrect email or password.' });
    }
    delete user.password;
    return cb(null, user, {
      message: 'Logged In Successfully',
    });
  }
  return cb(null, false, { message: 'Incorrect email or password.' });
})
  .catch((err) => {
    console.log(err);
    return cb(err);
  }))));
