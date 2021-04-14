var mongoose = require('mongoose');

var lmsforumfileSchema = mongoose.Schema({
    count: Number,
    id: Number
});

module.exports = mongoose.model('lmsforumfile', lmsforumfileSchema);
