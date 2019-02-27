'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    username: {
        type: String,
        required: 'Username obligatoire',
        unique: true
    },
    password: {
        type: String,
        required: ' Mot de passe obligatoire'
    },
});

module.exports = mongoose.model('Users', UserSchema);
