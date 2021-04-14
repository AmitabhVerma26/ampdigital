var mongoose = require('mongoose');

var quizSchema = mongoose.Schema({
    quiz_title: String,
    maxTimeToFinish: Number,
    pages: String,
    deleted: String
});

module.exports = mongoose.model('quiz', quizSchema);
