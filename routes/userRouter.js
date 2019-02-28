'use strict';
module.exports = function(app) {
    var userController = require('../controllers/userController.js');

    app.route("/users").post(userController.userAdd);
    app.route("/users/:id").get(userController.userGet).delete(userController.userDelete);
};
