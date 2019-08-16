const mongoose = require('mongoose');

var TagModel = new mongoose.Schema({
    name_fr: String,
    type: String
})

module.exports = mongoose.model('tag', TagModel);