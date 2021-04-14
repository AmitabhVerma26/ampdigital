var mongoose = require('mongoose');

var forgotpasswordSchema = mongoose.Schema({
    email: String,
    date: String
});

module.exports = mongoose.model('forgotpassword', forgotpasswordSchema);
