var mongoose = require('mongoose');

var webinarSchema = mongoose.Schema({
    webinarpicture: {
        type: String
    },
    webinaroverview: {
        type: String
    },
    webinarkeywords: {
        type: String
    },
    webinarvideo: {
        type: String
    },
    speakerpicture: {
        type: String
    },
    webinarurl: {
        type: String
    },
    webinarname: {
        type: String,
    },
    level: {
        type: String
    },
    date: {
        type: Date,
    },
    duration: {
        type: Number,
    },
    speakername: {
        type: String,
    },
    speakerdescription: {
        default: "",
        type: String
    },
    keytakeaway: {
        type: String
    },
    sessionagenda: {
        type: String
    },
    deleted: {
        type: Boolean
    }
});

module.exports = mongoose.model('webinar', webinarSchema);
