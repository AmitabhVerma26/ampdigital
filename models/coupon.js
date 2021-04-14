var mongoose = require('mongoose');

var couponcodeSchema = mongoose.Schema({
    name: String,
    discount: Number,
    type: String,
    validfrom: Date,
    validto: Date,
    created: Date,
    deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('coupon', couponcodeSchema);