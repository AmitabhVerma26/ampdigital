var mongoose = require('mongoose');

var certificateSchema = mongoose.Schema({
    certificate_id: String,
    certificate_image: String
});

module.exports = mongoose.model('certificate', certificateSchema);
