const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//schema
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

//export
module.exports = mongoose.model('User', userSchema);