const tagService = require('../../services/tag/tag.service');

const TagController = {
    getTags: async (req, res) => {
        const searchWord = req.query.search ? req.query.search : null;
        let r = await tagService.getTagsByName(searchWord);
        res.send(r ? r :  []);
    }
}

module.exports = TagController;