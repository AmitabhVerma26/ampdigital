var mongoose = require('mongoose');

var quizlogSchema = mongoose.Schema({
    quizid: String,
    email: String,
    date: String,
    queNo: String,
    questionCorrectIncorrect: String,
    queAns: String
});

module.exports = mongoose.model('quelog', quizlogSchema);