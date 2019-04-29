const
    _ = require('lodash'),
    mongoose = require('mongoose'),
    validator = require('validator'),
    { User } = require('./user'),
    { Material } = require('./material'),
    { Supplier } = require('./supplier'),
    { POSupplier } = require('./posupplier');


var MaterialSupplierSchema = new mongoose.Schema({
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
    supplierId: {
        type: String
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number
    },
    poSupplierId: {
        type: String
    }
});

MaterialSupplierSchema.statics.getAll = function () {
    var materialsupplier = MaterialSupplier.find();
    var user = User.getAll();
    var material = Material.getAll();
    var supplier = Supplier.getAll();
    var POsupplier = POSupplier.getAll();

    return Promise.all([materialsupplier, user, material, supplier, POsupplier]).then(collections => {
        var data = [];

        collections[0].forEach((materialsupplier) => {
            //this is to insert a value to parentId if it's null or undefined
            temp = materialsupplier.parentId == null || materialsupplier.parentId == undefined ? materialsupplier._id : materialsupplier.parentId;
            data.push(
                {
                    _id: materialsupplier._id,
                    parentId: temp,
                    dateInserted: materialsupplier.dateInserted,
                    insertedBy: collections[1].find(o => o._id == materialsupplier.insertedBy),
                    materialId: collections[2].find(o => o._id == materialsupplier.materialId),
                    supplierId: collections[3].find(o => o._id == materialsupplier.supplierId),
                    price: materialsupplier.price,
                    quantity: materialsupplier.quantity,
                    poSupplierId: collections[4].find(o => o._id == materialsupplier.poSupplierId)
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

var MaterialSupplier = mongoose.model('MaterialSupplier', MaterialSupplierSchema);
module.exports = { MaterialSupplier };
