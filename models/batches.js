var mongoose = require('mongoose');

var lmsbatchSchema = mongoose.Schema({
    course_id: String,
    batch_name: String,
    batch_createdon: String,
    deleted: String
});

module.exports = mongoose.model('lmsbatch', lmsbatchSchema);
