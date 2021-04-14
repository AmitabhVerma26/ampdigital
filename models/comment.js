var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
    blogid: String,
    name: String,
    email: String,
    comment: String,
    date: Date
});

module.exports = mongoose.model('comment', commentSchema);