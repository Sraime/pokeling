const PokemonModel = require('../../models/pokemon.model');
const service = require('./pokemon.service');

describe('pokemon.service', () => {
    let spyFind
    
    describe('getPokemonsByName()', () => {
        beforeEach(() => {
            spyFind = jest.spyOn(PokemonModel, 'find');
        });

        it('shoudl call the odm with the limit of 15', async() => {
            service.getPokemonsByName(null);
            expect(spyFind).toHaveBeenCalledWith({}, null, {limit: 15});
        })

        it('shoudl find with the searching word at starting name (insensitive) when it is not null', async() => {
            service.getPokemonsByName('a');
            expect(spyFind).toHaveBeenCalledWith({name_fr: new RegExp('^a','i')}, null, {limit: 15});
        })
    });
});