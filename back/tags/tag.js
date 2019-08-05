var mongoose = require('mongoose');

var tagSchema = new mongoose.Schema({
    name_en: {type: String},
    name_fr: {type: String},
    type: {type: String}
},{timestamps: false})

module.exports = mongoose.model("tag", tagSchema);