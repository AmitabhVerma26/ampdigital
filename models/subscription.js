var mongoose = require('mongoose');

var subscriptionSchema = mongoose.Schema({
    email: String,
    deleted: String
});

module.exports = mongoose.model('subscription', subscriptionSchema);
