var mongoose = require('mongoose');

var quizlogSchema = mongoose.Schema({
    quizid: String,
    email: String,
    date: String,
    quizcompleted: String,
    queNo: Number,
    questionCorrectIncorrect: String,
    quizAnswers: String,
    score: Number,
    totalquestions: Number,
    maxtime: Number
});

module.exports = mongoose.model('quizlog', quizlogSchema);