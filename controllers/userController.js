

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userModel = mongoose.model('Users');


exports.userAdd = function (req, res) {
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
    if (err) return res.json({ error: true, data: err });
    return res.status(201).json({ error: false, data: user, message: 'User created' });
  });
};

exports.userGet = function (req, res) {
  userModel.findById(req.params.id, (err, user) => {
    if (err) return res.json({ error: true, data: err, message: err.message });
    if (req.decoded._id === user._id.toString()) return res.json({ data: user, error: false, message: '' });
    return res.status(403).json({ error: true, message: 'Access denied', data: null });
  });
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
