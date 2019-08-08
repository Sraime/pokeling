const mongoose = require ('mongoose');

const TagModel = new mongoose.Schema({
    name_fr: {type: String},
    type: {type: String}
});

module.exports = mongoose.model('tag',TagModel);