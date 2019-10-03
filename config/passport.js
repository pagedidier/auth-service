const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');


passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
},
((username, password, cb) => userModel.findOne({ username }, (err, user) => {
  if (user) {
    if (user.status !== 'validated') {
      return cb(false, null, { message: 'You have to validate your email address before login' });
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return cb(false, null, { message: 'Incorrect email or password.' });
    }
    delete user.password;
    return cb(false, user, {
      message: 'Logged In Successfully',
    });
  }
  return cb(false, null, { message: 'Email account not found' });
})
  .catch((err) => {
    console.log(err);
    return cb(err);
  }))));
