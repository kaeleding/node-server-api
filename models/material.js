const
    _ = require('lodash'),
    mongoose = require('mongoose'),
    validator = require('validator'),
    { User } = require('./user');



var MaterialSchema = new mongoose.Schema({
    //DEFAULT
    parentId: {
        type: String
    },
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
    code: {
        type: String
    },
    description: {
        type: String
    },
    unit: {
        type: String
    },
    type: {
        type: String
    }
});

// http://mongoosejs.com/docs/guide.html - for mongoose api

MaterialSchema.statics.getAll = function () {
    var material = Material.find();
    var user = User.getAll();

    return Promise.all([material, user]).then(collections => {
        var data = [];

        collections[0].forEach((material) => {
            //this is to insert a value to parentId if it's null or undefined
            temp = material.parentId == null || material.parentId == undefined ? material._id : material.parentId;
            data.push(
                {
                    _id: material._id,
                    parentId: temp,
                    dateInserted: material.dateInserted,
                    insertedBy: collections[1].find(o => o._id == material.insertedBy),
                    code: material.code,
                    description: material.description,
                    unit: material.unit,
                    type: material.type,
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


var Material = mongoose.model('Material', MaterialSchema);
module.exports = { Material };
