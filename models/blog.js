var mongoose = require('mongoose');

var blogSchema = mongoose.Schema({
    image: {
        type: String
    },
    blogurl: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    authoremail: String,
    overview: {
        type: String,
        default: ""
    },
    readers: {
        type: Array,
        default: []
    },
    blogathon: {
        type: Boolean,
        default: false
    },
    tags: {
        default: "",
        type: String
    },
    content: {
        type: String
    },
    approved: {
        type: Boolean
    },
    metatitle: String,
    metakeywords: String,
    metadescription: String,
    deleted: {
        type: Boolean
    }
});

module.exports = mongoose.model('blog', blogSchema);
