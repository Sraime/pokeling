const service = require('./tag.service');
const mongoose = require('mongoose');
const TagModel = require('../../models/tag.model');

describe('tag.service', () => {
    
    describe('getTagsByName', () => {
        let spyFind = jest.spyOn(TagModel, 'find'); 

        beforeEach(() => {
            spyFind.mockClear();
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
    
    describe('getTagsById', () => {
        let spyFind = jest.spyOn(TagModel, 'find'); 
        
        beforeEach(() => {
            spyFind.mockClear();
        });

        it('should return null when param is a string', () => {
            let r = service.getTagsById('toto');
            expect(r).toBeNull();
        });

        it('should return null when param is an object', () => {
            let r = service.getTagsById({});
            expect(r).toBeNull();
        });
        
        it('should return null if one of the id is not correct', () => {
            let r = service.getTagsById(['aaaa']);
            expect(r).toEqual(null);
        });
        
        it('should return the list of retrived tags', () => {
            spyFind.mockReturnValue([]);
            let r = service.getTagsById(['5d4f171d6996c052e0cbc457']);
            expect(r).toEqual([]);
            expect(spyFind).toHaveBeenCalledWith({
                _id : {$in : [mongoose.Types.ObjectId('5d4f171d6996c052e0cbc457')]}
            })
        });
        
    });
});