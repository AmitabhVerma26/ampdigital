var mongoose = require('mongoose');

var simulationppcadSchema = mongoose.Schema({
    client: String,
    goal: String,
    keyword: String,
    question1answer: Array,
    question2answer: String,
    question3answer: Array,
    question4answer: String,
    question5answer: String,
    question6answer: String
});
module.exports = mongoose.model('simulationppcad', simulationppcadSchema);
