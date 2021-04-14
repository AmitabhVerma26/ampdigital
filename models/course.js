var mongoose = require('mongoose');

var courseSchema = mongoose.Schema({
    course_info: String,
    course_name: String
});

module.exports = mongoose.model('course', courseSchema);
