const mongoose = require('mongoose');

const userModel = mongoose.model('Users');

const jwt = require('jsonwebtoken');

const { secret } = require(`${__dirname}/../config/config.json`);


exports.userGet = function (req, res) {
  userModel.findById(req.params.id, (err, user) => {
    if (err) return res.json({ error: true, data: err, message: err.message });
    user.set('password');
    if (req.decoded._id === user._id.toString()) return res.json({ data: user, error: false, message: '' });
    return res.status(403).json({ error: true, message: 'Access denied', data: null });
  });
};

exports.userUpdate = function (req, res) {

};


exports.userDelete = function (req, res) {
  userModel.deleteOne({
    _id: req.params.id,
  }, (err, user) => {
    if (err) return res.json({ data: err, error: true, message: err.message });
    return res.status(201).json({
      error: false,
      message: 'User deleted',
      data: null,
    });
  });
};


exports.resetPassword = function (req, res) {


};

exports.validate = function (req, res) {
  const { token } = req.body;

  const decoded = jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      // Send link to new token
      return res.status(400).json({
        message: 'Token is not valid',
        error: true,
        data: null,
      });
    }
    return decoded;
  });
  userModel.findById(req.params.id, (err, user) => {
    if (err) return res.json({ error: true, data: err, message: err.message });
    user.status = decoded.nextStatus;
    user.save((saveErr) => {
      if (saveErr) return res.json({ error: true, data: saveErr, message: saveErr.message });
      return res.json({ error: false, data: '', message: 'validated' });
    });
  });
};
