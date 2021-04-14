var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    message: String
});

module.exports = mongoose.model('contactuser', userSchema);
