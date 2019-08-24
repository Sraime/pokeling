const bankService = require('../../services/bank/bank.service');
const pokemonService = require('../../services/pokemon/pokemon.service');
const tagService = require('../../services/tag/tag.service');

const BankController = {

    getOwnedPokemons: async(req, res) => {
        let pokes = await bankService.getOwned(req.user.pseudo);
        res.json(pokes);
    },

    addOwnedPokemon: async(req, res) => {
        try {
            let p = await pokemonService.getPokemonById(req.body.pokemonId);
            const tags = req.body.tagsIds ? await tagService.getTagsById(req.body.tagsIds) : [];
            if(p && Array.isArray(tags)){
                let saved = await bankService.addOwnedPokemon(p.name_fr, req.user.pseudo, tags);
                return res.send(saved);
            }
        } catch(e) {}
        res.status(400);
        res.send();
    },

    deleteOwnedPokemon: async(req, res) => {
        try{
            await bankService.deletePokemonById(req.params.id, req.user.pseudo);
        } catch(e) {
            res.status(400);
            return res.send();
        }
        res.send({});
    }
}

module.exports = BankController;