const OwnedPokemonModel = require('../../models/owned-pokemon.model')

const BankService = {

    getOwned : async(pseudo) => { 
        return OwnedPokemonModel.find({userPseudo: pseudo});
    },

    addOwnedPokemon: (pokemonName, userPseudo, tags) => {
        let nop = OwnedPokemonModel({
            name_fr: pokemonName,
            userPseudo: userPseudo,
            tags: tags
        });
        return nop.save();
    }
}

module.exports = BankService;