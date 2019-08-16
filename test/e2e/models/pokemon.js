const mongoose = require('mongoose');

var PokemonModel = new mongoose.Schema({
    name_fr: String
})

module.exports = mongoose.model('pokemon', PokemonModel);