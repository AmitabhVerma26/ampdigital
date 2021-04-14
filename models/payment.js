var mongoose = require('mongoose');

var paymentSchema = mongoose.Schema({
    payment_request_id: String,
    phone: String,
    email: String,
    buyer_name: String,
    amount: Number,
    purpose: String,
    status: String,
    date: Date,
    couponcode: String,
    coupontype: String,
    couponcodeapplied: String,
    discount: Number,
    offertoparticipant: Number,
    participant: String,
    user_id: {type: String, default: ''},
    payment_id: {type: String, default: ''},
    updated: Date,
    registered: Date
});

module.exports = mongoose.model('payment', paymentSchema);