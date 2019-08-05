const request = require('request-promise-native');
const Validator = require('jsonschema').Validator;
const bankResponseSchema = require('./schemas/bank/bank-response');
const UserModel = require('../../app/models/user.model');
const OwnedPokemonModel = require('../../app/models/owned-pokemon.model');
const config = require('../../config');

const BASE_URI = 'http://localhost:'+config.app.port;

describe('GET Bank', () => {

    let reqOptions;
    const validator = new Validator();

    beforeEach(() => {
        reqOptions = {
            json: true,
            uri: BASE_URI+'/bank',
            method: 'GET',
        }
    });

    it('should return an error 401 when the user is not logged in', async() => {
        try {
            await request(reqOptions);
        } catch (error) {
            expect(error.statusCode).toEqual(401);
        }
    });


    describe('logged in', () => {
        let authToken;
    
        beforeAll(async() => {
            const existingUser = {
                pseudo: 'admin', 
                email: 'admin.admin@admin.com', 
                password: 'admin'
            }
            let nuser = new UserModel(existingUser);
            await nuser.save();
    
            const reqLogin = {
                json: true,
                uri: BASE_URI+'/auth/signin',
                method: 'POST',
                body : {
                    email: 'admin.admin@admin.com',
                    password: 'admin'
                }
            }
            let resLogin = await request(reqLogin);
            authToken = resLogin.token;
        });
    
        afterAll(async() => {
            await UserModel.deleteOne({pseudo: existingUser.pseudo});
        });

        beforeEach(() => {
            reqOptions.headers = {"Authorization":"Bearer " + authToken}
        });
    
        it('should return an empty list when the user does not have any pokemon', async() => {
            let r = await request(reqOptions);
            expect(validator.validate(r,bankResponseSchema).errors.length).toEqual(0);
            expect(r).toEqual([]);
        });
        
        describe('user with owned pokemons', () => {
            const ownedPokemons = [
                {name_fr: 'Pitchu', name_fr: 'Pitchu', userPseudo:'admin', tags: []},
                {name_fr: 'Pitchu', name_fr: 'Pitchu', userPseudo:'admin', tags: [
                    {name_fr: 'Super Ball', name_en: 'Super Ball', type: 'ball'}
                ]},
                {name_fr: "Pitchu", name_fr: "Pitchu", userPseudo:'admin', tags: [
                    {name_fr: 'Super Ball', name_en: 'Super Ball', type: 'ball'},
                    {name_fr: 'Brave', name_en: 'Brave', type: 'nature'}
                ]}
            ];
    
            let savedOwnedPokemons;
    
            beforeAll(async() => {
                savedOwnedPokemons = await OwnedPokemonModel.insertMany(ownedPokemons)
                savedOwnedPokemons = savedOwnedPokemons.map((e) => JSON.parse(JSON.stringify(e)));
            });
            
            afterAll(async() => {
                await OwnedPokemonModel.deleteMany({});
            });
            it('should return the list of owned pokemons with there tags', async() => {
                let r = await request(reqOptions);
                expect(validator.validate(r,bankResponseSchema).errors.length).toEqual(0);
                expect(r.length).toEqual(3);
                savedOwnedPokemons.forEach(element => {
                    expect(r).toContainEqual(element);
                });
            });
        });
    
        describe('user with owned pokemons', () => {
            let notOwnedPokemons = {name_fr: 'Pitchu', name_fr: 'Pitchu', userPseudo:'toto', tags: []};
    
            beforeAll(async() => {
                notOwnedPokemons = new OwnedPokemonModel(notOwnedPokemons);
                notOwnedPokemons.save()
            });
            
            afterAll(async() => {
                await OwnedPokemonModel.deleteMany({});
            });
            it('should return the list of owned pokemons with there tags', async() => {
                let r = await request(reqOptions);
                expect(r.length).toEqual(0);
            });
        });
    });
});