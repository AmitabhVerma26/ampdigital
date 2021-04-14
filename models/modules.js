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
    deleted: String
});

var lmstopicSchema = mongoose.Schema({
    course_id: String,
    module_id: String,
    topic_order: Number,
    topic_name: String,
    topic_createdon: String,
    deleted: String,
    elements: [lmselementSchema]
});

var lmsmoduleSchema = mongoose.Schema({
    course_id: String,
    module_order: Number,
    module_name: String,
    module_description: String,
    module_id: String,
    module_image: String,
    module_createdon: String,
    deleted: String,
    topics: [lmstopicSchema],
    topics2: String,
    percentagecompleted: String,
    modulewatchedpercentage: String,
    active: String,
    opens_on: Date,
    modulesVideoLength: String
});

module.exports = mongoose.model('lmsmodule', lmsmoduleSchema);
