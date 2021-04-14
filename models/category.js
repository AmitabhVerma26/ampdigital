var mongoose = require('mongoose');

var categorySchema = mongoose.Schema({
    readcount: {
        type: Number,
        default: 0
    },
    name: {
        type: String
    },
    categoryurl: String,
    deleted: {
        type: Boolean
    },
    date: Date
});

module.exports = mongoose.model('category', categorySchema);
