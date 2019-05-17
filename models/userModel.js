
const mongoose = require('mongoose');

const { Schema } = mongoose;
const UserSchema = new Schema({
  username: {
    type: String,
    required: 'Username obligatoire',
    unique: true,
  },
  password: {
    type: String,
    required: ' Mot de passe obligatoire',
  },
});

module.exports = mongoose.model('Users', UserSchema);
