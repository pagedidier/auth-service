
module.exports = function (app) {
  const authController = require('../controllers/authController.js');

  app.route('/auth/register')
    .post(authController.register);
  app.route('/auth/login')
    .post(authController.login);
  app.route('/auth/tokens/renew')
    .post(authController.renewToken);
};
