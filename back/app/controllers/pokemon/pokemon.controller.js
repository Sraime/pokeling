const pokemonService = require('../../services/pokemon/pokemon.service');

const PokemonController = {

    getPokemons: async (req, res) => {
        let r = await pokemonService.getPokemonsByName(req.query? req.query.search : null);
        res.send(r ? r : []);
    }

}

module.exports = PokemonController;