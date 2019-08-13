const request = require('request-promise-native');
const Validator = require('jsonschema').Validator;
const bankListResponseSchema = require('./schemas/bank/bank-list-response');
const bankCreateResponseSchema = require('./schemas/bank/bank-create-response');
const UserModel = require('../../app/models/user.model');
const OwnedPokemonModel = require('../../app/models/owned-pokemon.model');
const config = require('../../config');
const PokemonModel = require('../../app/models/pokemon.model');
const TagModel = require('../../app/models/tag.model');

const BASE_URI = 'http://localhost:'+config.app.port;

describe('/bank', () => {

    let authToken;
    const validator = new Validator();
    let existingUser;
        
    beforeAll(async() => {
        existingUser = {
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
    
    describe('GET /bank', () => {
        let reqOptions;
    
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
    
            beforeEach(() => {
                reqOptions.headers = {"Authorization":"Bearer " + authToken}
            });
        
            it('should return an empty list when the user does not have any pokemon', async() => {
                let r = await request(reqOptions);
                expect(validator.validate(r,bankListResponseSchema).errors.length).toEqual(0);
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
                    expect(validator.validate(r,bankListResponseSchema).errors.length).toEqual(0);
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
    
    describe('POST /bank', () => {
    
        let reqOptions = {
            json: true,
            method: 'POST',
            uri: BASE_URI+'/bank'
        }
        let existingPoke;
        let existingTag;
    
        beforeAll(async() => {
            existingPoke = new PokemonModel({name_fr: 'Poke1'});
            existingTag = new TagModel({name_fr: 'Tag1', type: 'Type1'});
            existingPoke.save();
            existingTag.save();
        });

        afterAll(async() => {
            PokemonModel.deleteMany({});
            TagModel.deleteMany({});
        });
    
        beforeEach(() => {
            reqOptions.body = {};
        });
        
        it('should return an error 401 when the user is not logged in', async() => {
            try{
                await request(reqOptions);
            } catch(e) {
                expect(e.statusCode).toEqual(401);
            }
        })
    
        describe('logged in', () => {
            beforeEach(() => {
                reqOptions.headers = {"Authorization":"Bearer " + authToken}
            });

            it('should return an error 400 when the pokemonId is not given', async () => {
                reqOptions.body = {};
                try{
                    await request(reqOptions);
                } catch(e) {
                    expect(e.statusCode).toEqual(400);
                }
            });
            
            it('should return an error 400 when the pokemonId not exist', async () => {
                reqOptions.body = {pokemonId: '123456789'};
                try{
                    await request(reqOptions);
                } catch(e) {
                    expect(e.statusCode).toEqual(400);
                }
            });
            
            it('should return an error 400 when the list of tags contain a not existing tagsIds', async () => {
                reqOptions.body = {pokemonId: existingPoke.id+'', tagsIds: ['123456789']};
                try{
                    await request(reqOptions);
                } catch(e) {
                    expect(e.statusCode).toEqual(400);
                }
            });
            
            it('should return the created owned pokemon when it succeed', async () => {
                reqOptions.body = {pokemonId: existingPoke.id+'', tagsIds: [existingTag.id+'']};
                let r = await request(reqOptions);
                expect(validator.validate(r,bankCreateResponseSchema).errors.length).toEqual(0);
                expect(r.name_fr).toEqual(existingPoke.name_fr);
                expect(r.userPseudo).toEqual(existingUser.pseudo);
                expect(r.tags).toEqual([{name_fr: existingTag.name_fr, type: existingTag.type}]);
                await OwnedPokemonModel.findByIdAndDelete(r._id);
            });
        });
    });
});
