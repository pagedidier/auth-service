const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');


const mailController = require('../controllers/mailController');

const { secret, tokenValideDuration } = require('../config/config.json');
const configFile = require('../config/config.json');

const environment = process.env.NODE_ENV || 'dev';
const config = configFile[environment];

const { handleError, ErrorHandler } = require('../helpers/error');


const UserModel = mongoose.model('Users');

exports.register = (req, res, next) => {
  const {
    username,
    email,
    password,
    frontUrl,
  } = req.body;
  if (!username || !password) throw new ErrorHandler(400, 'Username and password are required');
  const hashedPassword = bcrypt.hashSync(password, 8);
  const newUser = new UserModel({
    username,
    email,
    password: hashedPassword,
  });
  newUser.save((err, user) => {
    if (err) return next(new ErrorHandler(400, err));

    user.set('password');
    const validationToken = jwt.sign({ nextStatus: 'validated' }, secret, { expiresIn: '1d' });
    // TODO : check if it's not too long
    const validationLink = `http://${frontUrl}/validation?id=${user._id}&token=${validationToken}`;
    const mailOptions = {
      from: config.mail.address,
      to: email,
      subject: 'Validate your email address',
      text: validationLink,
      html: `<a>${validationLink}</a>`,
    };

    // TODO : handle error
    mailController.sendMail(mailOptions);
    return res.status(201).json({ error: false, message: 'Successfully register, please valid your email address', data: user });
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

exports.renewToken = (req, res) => {

};
