const
    _ = require('lodash'),
    mongoose = require('mongoose'),
    validator = require('validator'),
    { RefStatusDesign } = require('./ref_statusdesign'),
    { User } = require('./user');


var DesignStatusSchema = new mongoose.Schema({
    //DEFAULT
    dateInserted: {
        type: Date,
        required: true,
        default: Date.now

    },
    insertedBy: {
        type: String,
        required: true
    },
    //END of DEFAULT

    designId: {
        type: String
    },
    statusId: {
        type: String
    }
});

DesignStatusSchema.statics.getAll = function () {
    var orig = DesignStatus.find();
    var user = User.getAll();
    var stat = RefStatusDesign.getAll();

    return Promise.all([orig, user, stat]).then(collections => {
        var data = [];

        collections[0].forEach((el) => {
            data.push(
                {
                    _id: el._id,
                    dateInserted: el.dateInserted,
                    insertedBy: collections[1].find(o => o._id == el.insertedBy),
                    designId: el.design,
                    statusId: collections[2].find(o => o._id == el.statusId)
                }
            )
        })

        // to sort by dateInserted

        data.sort((a, b) => {
            if (a.dateInserted < b.dateInserted)
                return 1;
            if (a.dateInserted > b.dateInserted)
                return -1;
            return 0;
        });

        // this is to get distinct values of parentId

        data = _.uniqBy(data, (v) => {
            return JSON.stringify(v.parentId);
        });

        return data;
    });
}

// http://mongoosejs.com/docs/guide.html - for mongoose api

var DesignStatus = mongoose.model('DesignStatus', DesignStatusSchema);
module.exports = { DesignStatus };
