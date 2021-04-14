var mongoose = require('mongoose');

var pageviewSchema = mongoose.Schema({
    visitor_ip: {
        type: String
    },
    page_url: {
        type: String
    },
    user: {
        type: String,
        default: "Guest"
    },
    user_name: {
        type: String,
        default: "Guest"
    },
    country: {
        type: String,
        default: ""
    },
    country_code: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    continent: {
        type: String,
        default: ""
    },
    time_zone: {
        type: String,
        default: ""
    },
    org: {
        type: String,
        default: ""
    },
    subdivision: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model('pageview', pageviewSchema);
