var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    message: String,
    event: {}
});

module.exports = mongoose.model('eventjoinee', eventSchema);