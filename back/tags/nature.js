var mongoose = require('mongoose');

var natureSchema = new mongoose.Schema({
    name: {type: String},
    name_fr: {type: String}
},{timestamps: false})

module.exports = mongoose.model("nature", natureSchema);