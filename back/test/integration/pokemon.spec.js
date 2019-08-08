const PokemonModel = require('../../app/models/pokemon.model.js')
const config = require('../../config');
const request = require('request-promise-native');
const BASE_URL = 'http://localhost:'+config.app.port;

describe('/pokemon', () => {
    
    const existingPokemons = [
        {name_fr: 'Bulbizarre'},
        {name_fr: 'Herbizarre'},
        {name_fr: 'Florizarre'},
        {name_fr: 'Salameche'},
        {name_fr: 'Reptincel'},
        {name_fr: 'Dracaufeu'},
        {name_fr: 'Carapuce'},
        {name_fr: 'Carabaffe'},
        {name_fr: 'Tortank'},
        {name_fr: 'Chenipan'},
        {name_fr: 'Chrysacier'},
        {name_fr: 'Papilusion'},
        {name_fr: 'Aspicot'},
        {name_fr: 'Coconfort'},
        {name_fr: 'Dardargnan'},
        {name_fr: 'Roucool'},
    ];

    const reqOptions = {
        json: true,
        method: 'GET'
    };

    beforeAll(async() => {
        await PokemonModel.insertMany(existingPokemons);
    });

    afterAll(async() => {
        await PokemonModel.deleteMany({});
    });

    beforeEach(() => {
        reqOptions.uri = BASE_URL+'/pokemon';
    });

    it('it should return a list of 15 pokemons', async() => {
        let r = await request(reqOptions);
        expect(r.length).toEqual(15);
    })

    it('it should return a list of 5 pokemons starting by "C" when the search word is "c"', async() => {
        reqOptions.uri = reqOptions.uri+"?search=c"
        let r = await request(reqOptions);
        expect(r.length).toEqual(5);
    })

    it('it should return a list of 5 pokemons starting by "C" when the search word is "C"', async() => {
        reqOptions.uri = reqOptions.uri+"?search=C"
        let r = await request(reqOptions);
        expect(r.length).toEqual(5);
    })

    it('it should return a list of 2 pokemons starting by "Ca" when the search word is "ca"', async() => {
        reqOptions.uri = reqOptions.uri+"?search=ca"
        let r = await request(reqOptions);
        expect(r.length).toEqual(2);
    })
});