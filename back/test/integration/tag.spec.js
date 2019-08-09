const TagModel = require('../../app/models/tag.model');
const config = require('../../config');
const request = require('request-promise-native');
const Validator = require('jsonschema').Validator;
const TagListSchema = require('./schemas/tag/tag-list-response.json');

describe('GET /tag', () => {
    
    const existingTags= [
        {name_fr: 'Puanteur', type:'ability'},
        {name_fr: 'Crachin', type:'ability'},
        {name_fr: 'Turbo', type:'ability'},
        {name_fr: 'Armurbaston', type:'ability'},
        {name_fr: 'Fermeté', type:'ability'},
        {name_fr: 'Jet de sable', type:'move'},
        {name_fr: 'Plaquage', type:'move'},
        {name_fr: 'Bélier', type:'move'},
        {name_fr: 'Ligotage', type:'move'},
        {name_fr: 'Charge', type:'move'},
        {name_fr: 'Mimi-queue', type:'move'},
        {name_fr: 'Mania', type:'move'},
        {name_fr: 'Supper Ball', type:'move'},
        {name_fr: 'Poke Ball', type:'move'},
        {name_fr: 'Hyper Ball', type:'move'},
        {name_fr: 'Master Ball', type:'move'},
    ];
    const BASE_URL = 'http://localhost:'+config.app.port;
    let reqOptions;
    const validator = new Validator();

    beforeAll(async() => {
        await TagModel.insertMany(existingTags);
    });

    afterAll(async() => {
        await TagModel.deleteMany({});
    });

    beforeEach(() => {
        reqOptions = {
            json: true,
            method: 'GET',
            uri: BASE_URL+'/tag'
        }
    });

    it('should return a list of 15 tags', async() => {
        let r = await request(reqOptions);
        expect(r.length).toEqual(15);
        expect(validator.validate(r,TagListSchema).errors.length).toEqual(0);
    });

    it('should return a list of 3 tags when the starting with "M" when the searching word is "m"', async() => {
        reqOptions.uri = reqOptions.uri+'?search=m';
        let r = await request(reqOptions);
        expect(r.length).toEqual(3);
    })

    it('should return a list of 3 tags when the starting with "M" when the searching word is "M"', async() => {
        reqOptions.uri = reqOptions.uri+'?search=M';
        let r = await request(reqOptions);
        expect(r.length).toEqual(3);
    })

    it('should return a list of 2 tags when the starting with "Ma" when the searching word is "ma"', async() => {
        reqOptions.uri = reqOptions.uri+'?search=ma';
        let r = await request(reqOptions);
        expect(r.length).toEqual(2);
    })
});