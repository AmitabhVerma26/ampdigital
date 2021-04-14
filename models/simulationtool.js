var mongoose = require('mongoose');

var simulationtoolSchema = mongoose.Schema({
    tool_name: String,
    tool_url: String,
    tool_description: String,
    tool_id: String,
    tool_image: String
});
module.exports = mongoose.model('simulationtool', simulationtoolSchema);
