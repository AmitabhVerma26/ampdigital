var mongoose = require('mongoose');

var webinareeSchema = mongoose.Schema({
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    certificates: Array,
    termsandconditions: {
        type: Boolean
    },
    countrycode: {
        type: String
    },
    date: {
        type: Date
    },
    webinarid: {
        type: String
    },
    webinarname:{
        type: String
    }
});

module.exports = mongoose.model('webinaree', webinareeSchema);
