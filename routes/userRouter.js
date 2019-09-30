
const { checkToken } = require('../middleware/checkToken');

module.exports = function (app) {
  const userController = require('../controllers/userController.js');

  app.route('/users/:id')
    .get(checkToken, userController.userGet)
    .put(checkToken, userController.userUpdate)
    .delete(checkToken, userController.userDelete);

  app.route('/users/:id/validate')
    .post(userController.validate);


  app.route('/users/reset')
    .post(userController.resetPassword);
};
