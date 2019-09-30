const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { secret } = require(`${__dirname}/../config/config.json`);
const { tokenValideDuration } = require(`${__dirname}/../config/config.json`);

const mongoose = require('mongoose');

const userModel = mongoose.model('Users');

exports.register = (req, res) => {
  if (req.body.username === undefined || req.body.password === undefined) return res.status(400).json({ error: true, message: 'You should provide a username and a password', data: null });
  const {
    username,
    password,
  } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  const user = new userModel({
    username,
    password: hashedPassword,
  });
  user.save((err, user) => {
    user.set('password');
    if (err) return res.status(201).json({ error: true, message: 'Error while register ', data: err });
    return res.status(201).json({ error: false, message: 'Successfully register', data: user });
  });
};


exports.login = (req, res) => {
  passport.authenticate('local', { session: false }, (authenticateError, user, info) => {
    if (authenticateError || !user) {
      return res.status(400).json({
        message: info ? info.message : 'Login failed',
        data: user,
        error: true,
      });
    }

    req.login(user, { session: false }, (loginError) => {
      if (loginError) {
        res.send(loginError);
      }
      user.set('password');
      const token = jwt.sign({ _id: user._id, username: user.username }, secret, { expiresIn: tokenValideDuration, issuer: 'localhost' });
      return res.status(200).json({
        token, data: user, message: 'Successfully logged in', error: false,
      });
    });
  })(req, res);
};

exports.renewToken = (req,res)=> {

};
