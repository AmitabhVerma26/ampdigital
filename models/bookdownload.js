var mongoose = require('mongoose');

var bookdownloadSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    countrycode: String,
    phonenumber: String,
    date: Date
});
module.exports = mongoose.model('bookdownload', bookdownloadSchema);
