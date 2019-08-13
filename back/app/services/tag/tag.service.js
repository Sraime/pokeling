const TagModel = require('../../models/tag.model');
const mongoose = require('mongoose');

const TagService = {
    getTagsByName: (search) => {
        const filter = search ? {name_fr: new RegExp('^'+search,'i')} : {};
        return TagModel.find(filter, null, {limit: 15});
    },

    getTagsById: (tags) => {
        if(Array.isArray(tags)){
            try {
                let ids = tags.map((id) => mongoose.Types.ObjectId(id))
                return TagModel.find({
                    _id: {$in: ids}
                })
            }catch(e) {}
            
        }
        return null;
    }
}

module.exports = TagService;