var mongoose = require('mongoose');

var commentsSchema = mongoose.Schema({
    storyid: String,
    content: String,
    created: Date,
    modulename: String,
    moduleid: String,
    created_by_current_user: Boolean,
    fullname: String,
    email: String,
    id: Number,
    rootid: Number,
    idcount: Number,
    attachment_url: String,
    attachment_type: String,
    attachment_id: Number,
    attachments: {
        type: Array,
        default: []
    },
    modified: Date,
    parent: String,
    answered: {
        type: Boolean,
        default: false
    },
    replies: {
        type: Number,
        default:0
    },
    profile_picture_url: String,
    upvote_count: Number,
    user_has_upvoted: Boolean,
    upvoters: [{ type : String }]
});

module.exports = mongoose.model('forumcomment', commentsSchema);
