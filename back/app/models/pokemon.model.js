const mongoose = require('mongoose');

const PokemonModel = new mongoose.Schema({
    name_fr: {type: String}
});

module.exports = mongoose.model('pokemon',PokemonModel);