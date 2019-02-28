'use strict';
module.exports = function(app) {
    var authController = require('../controllers/authController.js');

    app.route('/auth/register')
        .post(authController.register);
    app.route('/auth/login')
        .post(authController.login);
};
