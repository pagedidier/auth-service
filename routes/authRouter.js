'use strict';
module.exports = function(app) {
    var authController = require('../controllers/authController.js');

    app.route('/auth/register')
        .post(authController.register);
};
