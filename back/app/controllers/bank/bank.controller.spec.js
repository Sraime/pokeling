const bankService = require('../../services/bank/bank.service');
const pokemonService = require('../../services/pokemon/pokemon.service');
const bankController = require('./bank.controller');
const tagService = require('../../services/tag/tag.service');

describe('bank.controller', () => {
    let res;
    let req;
    
    beforeEach(() => {
        res = {
            json: jest.fn(),
            send: jest.fn(),
            status: jest.fn()
        }
        req = {
            user: {pseudo: 'admin'}
        }
    });

    describe('getOwnedPokemons()', () => {
        const spyGetOwned = jest.spyOn(bankService, 'getOwned');
        beforeEach(() => {
            spyGetOwned.mockClear();
        });

        it('should return an empty array when the service return an empty array', async() => {
            const serviceReturn = [];
            spyGetOwned.mockReturnValue(serviceReturn);
            let rs = await bankController.getOwnedPokemons(req, res);
            expect(spyGetOwned).toHaveBeenCalledWith(req.user.pseudo);
            expect(res.json).toHaveBeenCalledWith(serviceReturn);
        });

        it('should the list of owned pokemon returned by the service', async() => {
            const serviceReturn = [{name_fr: 'Pitchu', name_fr: 'Pitchu', userPseudo:'admin', tags: []}];
            spyGetOwned.mockReturnValue(serviceReturn);
            let rs = await bankController.getOwnedPokemons(req, res);
            expect(res.json).toHaveBeenCalledWith(serviceReturn);
        });
    });

    describe('addOwnedPokemon()', () => {
        const spyGetPokemonById = jest.spyOn(pokemonService, 'getPokemonById');
        const spyGetTagsById = jest.spyOn(tagService, 'getTagsById');
        const spyAddPokemon = jest.spyOn(bankService, 'addOwnedPokemon');

        beforeEach(() => {
            spyGetPokemonById.mockClear();
            spyGetPokemonById.mockReturnValue(null);
            
            spyGetTagsById.mockClear();
            spyGetTagsById.mockReturnValue(null);

            spyAddPokemon.mockClear();
            spyAddPokemon.mockReturnValue(null);
        });
        
        it('should send a 400 status code when the pokemonId is not given', async () => {
            req.body = {};
            await bankController.addOwnedPokemon(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalled();
        });

        it('should send a 400 status code when the given pokemonId does not exist', async () => {
            req.body = {pokemonId: 'notExistingId'};
            await bankController.addOwnedPokemon(req, res);
            expect(spyGetPokemonById).toHaveBeenCalledWith('notExistingId');
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalled();
        });

        it('should send a 400 status code when the given pokemonId is not valide', async () => {
            req.body = {pokemonId: 'invalidId'};
            spyGetPokemonById.mockImplementation(() => {
                throw new Error('invalid id');
            });
            await bankController.addOwnedPokemon(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalled();
        });

        it('should save and return the newly created owned pokemon', async () => {
            req.body = {pokemonId: 'existingId'};
            spyGetPokemonById.mockReturnValue({name_fr: 'Poke1'})
            const savedOwnedPoke = {_id: 123456789}
            spyAddPokemon.mockReturnValue(savedOwnedPoke)
            await bankController.addOwnedPokemon(req, res);
            expect(spyAddPokemon).toHaveBeenCalledWith('Poke1', req.user.pseudo, []);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith(savedOwnedPoke);
        });

        it('should save the newly created owned pokemon with given tags', async () => {
            req.body = {pokemonId: 'existingId', tagsIds: ['extistingId']};
            spyGetPokemonById.mockReturnValue({name_fr: 'Poke1'})
            spyGetTagsById.mockReturnValue([{name_fr: 'Tag'}])
            await bankController.addOwnedPokemon(req, res);
            expect(spyAddPokemon).toHaveBeenCalledWith('Poke1', req.user.pseudo, [{name_fr: 'Tag'}]);
        });
        
        it('should not save when the pokemon does not exist', async () => {
            req.body = {pokemonId: 'notExistingId'};
            await bankController.addOwnedPokemon(req, res);
            expect(spyAddPokemon).not.toHaveBeenCalled();
        });

        it('should not save if the bank service return null', async () => {
            req.body = {pokemonId: 'existingId', tagsIds: 'invalid'};
            spyGetPokemonById.mockReturnValue({name_fr: 'Poke1'})
            await bankController.addOwnedPokemon(req, res);
            expect(spyGetTagsById).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalled();
        });
    });

    describe('deleteOwnedPokemon()', () => {
        
        const spyDeletePokemon = jest.spyOn(bankService, 'deletePokemonById');

        beforeEach(() => {
            req.params = {};
            spyDeletePokemon.mockClear();
            spyDeletePokemon.mockReturnValue(null);
        });

        it('should return an empty body if the operation succed', async() => {
            req.params = {id: 'validID'}
            await bankController.deleteOwnedPokemon(req,res);
            expect(spyDeletePokemon).toHaveBeenCalledWith('validID', req.user.pseudo);
            expect(res.send).toHaveBeenCalledWith({});
        });

        it('should return a 400 status code when the sevice throw an error', async () => {
            spyDeletePokemon.mockImplementation(() => {
                throw new Error('invalid id');
            });
            await bankController.deleteOwnedPokemon(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalled();
        });
    });
});