var mongoose = require('mongoose');

var ballSchema = new mongoose.Schema({
    name_en: {type: String},
    name_fr: {type: String}
},{timestamps: false})

module.exports = mongoose.model("ball", ballSchema);