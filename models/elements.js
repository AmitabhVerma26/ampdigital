var mongoose = require('mongoose');

var lmselementSchema = mongoose.Schema({
    element_type: String,
    element_val: String,
    element_order: String,
    element_completiondate: String,
    element_objective: String,
    element_createdon: String,
    element_course_id: String,
    element_module_id: String,
    element_taskid: String,
    element_name: String,
    deleted: String,
    duration: String,
    watchedby: [{ type : String }]
});

module.exports = mongoose.model('lmselement', lmselementSchema);
