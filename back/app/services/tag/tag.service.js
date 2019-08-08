const TagModel = require('../../models/tag.model');

const TagService = {
    getTagsByName: (search) => {
        const filter = search ? {name_fr: new RegExp('^'+search,'i')} : {};
        return TagModel.find(filter, null, {limit: 15});
    }
}

module.exports = TagService;