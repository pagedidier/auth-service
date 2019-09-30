const mongoose = require('mongoose');

const userModel = mongoose.model('Users');

exports.userGet = function (req, res) {
  userModel.findById(req.params.id, (err, user) => {
    user.set('password');
    if (err) return res.json({ error: true, data: err, message: err.message });
    if (req.decoded._id === user._id.toString()) return res.json({ data: user, error: false, message: '' });
    return res.status(403).json({ error: true, message: 'Access denied', data: null });
  });
};

exports.userUpdate = function (req,res) {

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


exports.resetPassword = function (req,res) {

};

exports.validate = function (req,res) {

};
