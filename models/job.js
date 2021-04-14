var mongoose = require('mongoose');

var jobSchema = mongoose.Schema({
    email: String,
    company: String,
    companylogo: String,
    jobtitle: String,
    state: String,
    city: String,
    employmenttype: String,
    senioritylevel: String,
    jobdescription: String,
    skillkeywords: String,
    optradio: String,
    remote: String,
    recruiterwebsite: String,
    approved: {
        default: false,
        type: Boolean
    },
    date: {
        type: Date
    },
    tags: {
        default: "",
        type: String
    },
    metadescription: {
        default: "",
        type: String
    },
    deleted: {
        default: false,
        type: Boolean
    }
});
module.exports = mongoose.model('job', jobSchema);
