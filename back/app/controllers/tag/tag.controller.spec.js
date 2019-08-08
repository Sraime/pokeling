const tagController = require('./tag.controller');
const tagService = require('../../services/tag/tag.service');

describe('tag.controller', () => {
    
    let req;
    let res;

    beforeEach(() => {
        req = {};
        res = {
            send: jest.fn()
        };
    });

    describe('getTags()', () => {
        let spyGetTagsByName;

        beforeEach(() => {
            spyGetTagsByName = jest.spyOn(tagService, 'getTagsByName');
        });

        it('should call the tag service with null when the search param is empty', async () => {
            req.query = {};
            spyGetTagsByName.mockReturnValue(null);
            await tagController.getTags(req, res);
            expect(spyGetTagsByName).toHaveBeenCalledWith(null);
        });
        
        it('should send an empty list when the service return nothing', async () => {
            req.query = {};
            spyGetTagsByName.mockReturnValue(null);
            await tagController.getTags(req, res);
            expect(res.send).toHaveBeenCalledWith([]);
        });
        
        it('should send the list of tags returned by the tag service', async () => {
            req.query = {};
            const returnedTags = [
                {name_fr: 'tag1', type: 'type1'},
                {name_fr: 'tag2', type: 'type2'}
            ];
            spyGetTagsByName.mockReturnValue(returnedTags);
            await tagController.getTags(req, res);
            expect(res.send).toHaveBeenCalledWith(returnedTags);
        });

        it('should call the service with the given search word in param', async () => {
            req.query = {search: 'test'};
            await tagController.getTags(req, res);
            expect(spyGetTagsByName).toHaveBeenCalledWith('test');
        });

    });
});