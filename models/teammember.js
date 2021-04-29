var mongoose = require('mongoose');

var teammeberSchema = mongoose.Schema({
    fullname: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String,
        required: true
    },
    profession: {
        type: String
    },
    organization: {
        type: String,
        required: true
    },
    teamid: {
        type: String
    },
    deleted: {
        type: Boolean
    }
});

module.exports = mongoose.model('teammember', teammeberSchema);
