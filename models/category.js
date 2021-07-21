var mongoose = require('mongoose');

var categorySchema = mongoose.Schema({
    name: {
        type: String
    },
    deleted: {
        type: Boolean
    },
    date: Date
});

module.exports = mongoose.model('category', categorySchema);
