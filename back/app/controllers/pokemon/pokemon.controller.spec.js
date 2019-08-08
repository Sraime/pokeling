const pokemonService = require('../../services/pokemon/pokemon.service');
const pokemonController = require('./pokemon.controller');

describe('pokemon.controller', () => {
    
    describe('getPokemons()', () => {
        
        let spyGetPokemonsByName;

        const req = {};
        const res = {
            send: jest.fn(),
            status: jest.fn()
        };

        beforeEach(() => {
            spyGetPokemonsByName = jest.spyOn(pokemonService, 'getPokemonsByName');
        });

        it('should return an empty list when the service return an empty result', async() => {
            spyGetPokemonsByName.mockReturnValue(null);
            await pokemonController.getPokemons(req, res);
            expect(res.send).toHaveBeenCalledWith([]);
        });

        it('should return the list return by the service', async() => {
            const resService = [{name_fr: 'poke1'},{name_fr: 'poke2'}];
            spyGetPokemonsByName.mockReturnValue(resService);
            await pokemonController.getPokemons(req, res);
            expect(res.send).toHaveBeenCalledWith(resService);
        });

        it('should call the service with the search param in the request', async() => {
            req.query = {search: "t"};
            await pokemonController.getPokemons(req, res);
            expect(spyGetPokemonsByName).toHaveBeenCalledWith(req.query.search);
        });
    });
});