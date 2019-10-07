const mongoose = require('mongoose');

const userModel = mongoose.model('Users');

const jwt = require('jsonwebtoken');

const mailController = require('../controllers/mailController');
const { secret, mail } = require('../config/config.json');
const { handleError, ErrorHandler } = require('../helpers/error');

exports.userGet = function (req, res) {
  userModel.findById(req.params.id, (err, user) => {
    if (err) throw new ErrorHandler(400, err.message);
    user.set('password');
    if (req.decoded._id === user._id.toString()) return res.json({ data: user, error: false, message: '' });
    throw new ErrorHandler(403, 'Access denied');
  });
};

exports.userUpdate = function (req, res) {

};


exports.userDelete = function (req, res) {
  userModel.deleteOne({
    _id: req.params.id,
  }, (err, user) => {
    if (err) throw new ErrorHandler(400, err.message);
    return res.status(201).json({
      error: false,
      message: 'User deleted',
      data: null,
    });
  });
};


exports.resetPassword = function (req, res) {
  const { email, frontUrl } = req.body;
  userModel.findOne({ email }, (findError, user) => {
    user.status = 'pending-reset';
    user.save((saveError) => {
      if (saveError) return res.json({ data: saveError, error: true, message: saveError.message });

      const resetToken = jwt.sign({ nextStatus: 'validated' }, secret, { expiresIn: '1d' });
      // TODO : check if it's not too long
      const validationLink = `http://${frontUrl}/user/reset/?id=${user._id}&token=${resetToken}`;
      const mailOptions = {
        from: mail.address,
        to: email,
        subject: 'Reset password',
        text: validationLink,
        html: `<a>${validationLink}</a>`,
      };
      mailController.sendMail(mailOptions);
      return res.status(200).json({ error: false, message: 'Please check pour mailbox', data: user });
    });
  });
};

exports.validate = function (req, res) {
  const { token } = req.body;
  if (!token) throw new ErrorHandler(400, 'You should provide a token');

  const decodedToken = jwt.verify(token, secret, (err, data) => {
    if (err) throw new ErrorHandler(400, 'Token is not valid');
    return data;
  });
  userModel.findById(req.params.id, (err, user) => {
    if (err) throw new ErrorHandler(400, err.message);
    user.status = decodedToken.nextStatus;

    user.save((saveErr) => {
      if (saveErr) throw new ErrorHandler(400, saveErr.message);
      return res.json({ error: false, data: '', message: 'validated' });
    });
  });
};
