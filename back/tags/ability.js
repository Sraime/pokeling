var mongoose = require('mongoose');

var abilitySchema = new mongoose.Schema({
    name: {type: String},
    name_fr: {type: String}
},{timestamps: false})

module.exports = mongoose.model("ability", abilitySchema);