var mongoose = require('mongoose');

var referralSchema = mongoose.Schema({
    referralcode: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    offertoenrollment: {
        type: String
    },
    offertoparticipant: {
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

module.exports = mongoose.model('referral', referralSchema);
