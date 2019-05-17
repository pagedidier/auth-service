
const { checkToken } = require('../middleware/checkToken');

module.exports = function (app) {
  const userController = require('../controllers/userController.js');

  app.route('/users')
    .post(checkToken, userController.userAdd);

  app.route('/users/:id')
    .get(checkToken, userController.userGet)
    .delete(checkToken, userController.userDelete);
};
