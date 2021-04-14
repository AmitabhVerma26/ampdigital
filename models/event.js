var mongoose = require('mongoose');

var eventSchema = mongoose.Schema({
    event_name: String,
    event_description: String,
    event_date: String,
    event_location: String,
    event_hostedby: String,
    event_latitude: String,
    event_longitude: String
});

module.exports = mongoose.model('event', eventSchema);
