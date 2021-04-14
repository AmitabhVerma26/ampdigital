var mongoose = require('mongoose');

var jobapplicationSchema = mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    recruiteremail: String,
    jobtitle: String,
    jobid: String,
    date: Date
});
module.exports = mongoose.model('jobapplication', jobapplicationSchema);
