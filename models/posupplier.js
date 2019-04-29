const
    _ = require('lodash'),
    mongoose = require('mongoose'),
    validator = require('validator'),
    { User } = require('./user'),
    { Project } = require('./project'),
    { Supplier } = require('./supplier');


var POSupplierSchema = new mongoose.Schema({
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
    projectId: {
        type: String
    },
    purchaseOrderNo: {
        type: String
    },
    supplier_id: {
        type: String
    }
});


POSupplierSchema.statics.getAll = function () {
    var posupplier = MaterialSupplier.find();
    var user = User.getAll();
    var supplier = Supplier.getAll();

    return Promise.all([posupplier, user, supplier]).then(collections => {
        var data = [];

        collections[0].forEach((posupplier) => {
            //this is to insert a value to parentId if it's null or undefined
            temp = posupplier.parentId == null || posupplier.parentId == undefined ? posupplier._id : posupplier.parentId;
            data.push(
                {
                    _id: posupplier._id,
                    parentId: temp,
                    dateInserted: posupplier.dateInserted,
                    insertedBy: collections[1].find(o => o._id == posupplier.insertedBy),
                    projectId: posupplier.projectId,
                    purchaseOrderNo: posupplier.purchaseOrderNo,
                    supplierId: collections[2].find(o => o._id == posupplier.insertedBy)
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


var POSupplier = mongoose.model('POSupplier', POSupplierSchema);
module.exports = { POSupplier };
