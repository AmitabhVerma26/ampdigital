var mongoose = require('mongoose');

var promotionSchema = mongoose.Schema({
    couponcode: {
        type: String,
        required: true
    },
    offer: {
        type: String
    },
    registered: {
        type: Number
    },
    paid: {
        type: Number
    },
    amount: {
        type: Number
    },
    deleted: {
        type: Boolean
    }
});

module.exports = mongoose.model('referral', promotionSchema);
