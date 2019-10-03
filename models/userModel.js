
const mongoose = require('mongoose');

const { Schema } = mongoose;
const UserSchema = new Schema({
  username: {
    type: String,
    required: 'Username obligatoire',
    unique: true,
  },
  email: {
    type: String,
    required: 'email obligatoire',
    unique: true,
  },
  password: {
    type: String,
    required: ' Mot de passe obligatoire',
  },
  status: {
    type: String,
    enum: ['pending-validate', 'validated', 'pending-reset', 'pending-removed'],
    default: 'pending-validate',
  },
});

module.exports = mongoose.model('Users', UserSchema);
