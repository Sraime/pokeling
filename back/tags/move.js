var mongoose = require('mongoose');

var moveSchema = new mongoose.Schema({
    name: {type: String},
    name_fr: {type: String}
},{timestamps: false})

module.exports = mongoose.model("move", moveSchema);