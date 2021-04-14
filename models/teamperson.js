var mongoose = require('mongoose');

var teampersonSchema = mongoose.Schema({
    name: String,
    designation: String,
    qualification: String,
    linkedinprofileurl: String,
    imageurl: String
});
module.exports = mongoose.model('teamperson', teampersonSchema);
