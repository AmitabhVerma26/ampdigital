var mongoose = require('mongoose');

var submissionSchema = mongoose.Schema({
    assignment_name: {
        type: String,
        required: true
    },
    assignment_id: {
        type: String,
        required: true
    },
    topic_name: {
        type: String,
        required: true
    },
    module_name: {
        type: String
    },
    course_name: {
        type: String
    },
    doc_url: {
        type: String
    },
    submitted_by_name: {
        type: String
    },
    submitted_by_email: {
        type: String
    },
    submitted_on: {
        type: Date
    },
    grade: {
        type: String
    },
    deleted: {
        type: Boolean
    }
});

module.exports = mongoose.model('submission', submissionSchema);
