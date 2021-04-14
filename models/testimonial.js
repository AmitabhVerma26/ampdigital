var mongoose = require('mongoose');

var testimonialSchema = mongoose.Schema({
    image: {
        type: String
    },
    name: {
        type: String
    },
    designation: String,
    testimonial: {
        type: String
    },
    deleted: {
        type: Boolean
    },
    date: Date
});

module.exports = mongoose.model('testimonial', testimonialSchema);
