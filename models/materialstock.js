const
    _ = require('lodash'),
    mongoose = require('mongoose'),
    validator = require('validator'),
    { Material } = require('./material'),
    { User } = require('./user');



var MaterialStockSchema = new mongoose.Schema({
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
    materialId: {
        type: String
    },
    stock: {
        type: Number
    }
});

// http://mongoosejs.com/docs/guide.html - for mongoose api

MaterialStockSchema.statics.getAll = function () {
    var matstock = MaterialStock.find();
    var user = User.getAll();
    var mats = Material.getAll();

    return Promise.all([matstock, user, mats]).then(collections => {
        var data = [];
        //this is to insert a value to parentId if it's null or undefined
        temp = matstock.parentId == null || matstock.parentId == undefined ? matstock._id : matstock.parentId;
        collections[0].forEach((matstock) => {
            data.push(
                {
                    _id: matstock._id,
                    parentId: matstock.parentId,
                    dateInserted: matstock.dateInserted,
                    insertedBy: collections[1].find(o => o._id == matstock.insertedBy),
                    materialId: collections[2].find(o => o._id == matstock.materialId),
                    stock: matstock.stock
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


var MaterialStock = mongoose.model('MaterialStock', MaterialStockSchema);
module.exports = { MaterialStock };
