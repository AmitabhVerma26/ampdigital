var mongoose = require('mongoose');

var simulatorpointSchema = mongoose.Schema({
    email: String,
    name: String,
    id: String,
    input1: Array,
    input2: String,
    input3: Array,
    input4: String,
    input5: String,
    input6: String,
    totalpoints: Number,
    date: Date
});

module.exports = mongoose.model('simulatorpoint', simulatorpointSchema);
