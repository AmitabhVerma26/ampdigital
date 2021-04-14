var mongoose = require('mongoose');

var forumSchema = mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    document: {
        type: String
    },
    postedby_email: String,
    postedby_name: String,
    date: {
        type: Date
    },
    elementid: String,
    topicid: String,
    moduleid: String,
    modulename: String,
    coursename: String,
    isreply: {
        type: Boolean,
        default: false
    },
    replyto: String,
    replies: Array,
    deleted: {
        type: Boolean
    }
});
module.exports = mongoose.model('forum', forumSchema);
