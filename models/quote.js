var mongoose = require('mongoose');

var quoteSchema = mongoose.Schema({
    quote: {
        type: String
    },
    author: String,
    genre: {
        type: String
    }
});

module.exports = mongoose.model('quote', quoteSchema);
