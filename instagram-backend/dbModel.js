const mongoose = require('mongoose');

// creating a mongoose instance
const instance = mongoose.Schema({
    caption: String,
    user: String,
    image: String,
    comments: []
});

module.exports = mongoose.model('posts', instance)