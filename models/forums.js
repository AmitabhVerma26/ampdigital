var mongoose = require('mongoose');

var lmsforumSchema = mongoose.Schema({
    course_id: String,
    module_order: Number,
    module_name: String,
    module_description: String,
    module_id: String,
    module_image: String,
    module_createdon: String,
    deleted: String,
    topics2: String,
    percentagecompleted: String,
    modulewatchedpercentage: String,
    modulesVideoLength: String
});

module.exports = mongoose.model('lmsforum', lmsforumSchema);
