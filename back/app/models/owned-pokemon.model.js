var mongoose = require('mongoose');

var TagSchema = new mongoose.Schema({
    name_fr: {type: String},
    name_en: {type: String},
    type: {type: String}
},{timestamps: false, _id: false})

var ownedPokemonSchema = new mongoose.Schema({
    name_fr: {type: String},
    name_en: {type: String},
    userPseudo: {type: String},
    tags: [TagSchema]
},{timestamps: false, versionKey: false})

module.exports = mongoose.model("owned_pokemon", ownedPokemonSchema);