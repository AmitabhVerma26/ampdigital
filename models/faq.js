var mongoose = require('mongoose');

var blogSchema = mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    answer: {
        type: String
    },
    category: {
        type: String
    },
    course_id: {
        type: String
    },
    course_name: {
        type: String
    },
    deleted: {
        type: Boolean
    }
});

module.exports = mongoose.model('faq2', blogSchema);
