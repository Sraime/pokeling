const service = require('./tag.service');
const TagModel = require('../../models/tag.model');

describe('tag.service', () => {
    
    describe('getTagsByName', () => {
        let spyFind;

        beforeEach(() => {
            spyFind = jest.spyOn(TagModel, 'find');  
        });

        it('should find with an empty filter and a limit of 15 when search is null', async() => {
            service.getTagsByName(null);
            expect(spyFind).toHaveBeenCalledWith({}, null, {limit: 15});
        });
        
        it('should find with name_fr startWith search word when search it is not null', async() => {
            service.getTagsByName('a');
            expect(spyFind).toHaveBeenCalledWith({name_fr: new RegExp('^a','i')}, null, {limit: 15});
        });
    });
});