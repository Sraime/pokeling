const OwnedPokemonModel = require('../../models/owned-pokemon.model')

const BankService = {

    getOwned : async(pseudo) => { 
        return OwnedPokemonModel.find({userPseudo: pseudo});
    }
}

module.exports = BankService;