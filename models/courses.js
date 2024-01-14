var mongoose = require('mongoose');

var lmscourseSchema = mongoose.Schema({
    course_name: String,
    course_mode: String,
    course_startdate: String,
    course_modules: String,
    course_price: String,
    course_live: String,
    course_discountactive: String,
    course_tax: String,
    course_discount: String,
    course_discount_valid: Date,
    course_certification: String,
    course_url: String,
    course_access_url: String,
    course_objective: String,
    course_category: String,
    course_image: String,
    course_projects: String,
    course_duration: String,
    course_target_audience: String,
    course_tools_requirements: String,
    course_createdon: String,
    deleted: String
});

module.exports = mongoose.model('lmscourse', lmscourseSchema);
