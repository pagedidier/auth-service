'use strict';
let checkToken = require('../middleware/checkToken').checkToken;

module.exports = function(app) {
    var userController = require('../controllers/userController.js');

    app.route("/users")
        .post(checkToken,userController.userAdd);

    app.route("/users/:id")
        .get(checkToken,userController.userGet)
        .delete(checkToken,userController.userDelete);
};
