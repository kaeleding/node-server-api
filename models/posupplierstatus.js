const
    _ = require('lodash'),
    mongoose = require('mongoose'),
    validator = require('validator'),
    { User } = require('./user'),
    { POSupplier } = require('./posupplier'),
    { RefStatusPOS } = require('./ref_statusPOS');


var POSupplierStatusSchema = new mongoose.Schema({
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
    poSupplierId: {
        type: String
    },
    statusId: {
        type: String
    }
});

// http://mongoosejs.com/docs/guide.html - for mongoose api


POSupplierStatusSchema.statics.getAll = function () {
    var posupplierstatus = POSupplierStatus.find();
    var user = User.getAll();
    var posupplier = POSupplier.getAll();
    var status = Status.getAll();

    return Promise.all([posupplierstatus, user, posupplier, status]).then(collections => {
        var data = [];

        collections[0].forEach((posupplierstatus) => {
            //this is to insert a value to parentId if it's null or undefined
            temp = posupplierstatus.parentId == null || posupplierstatus.parentId == undefined ? posupplierstatus._id : posupplierstatus.parentId;
            data.push(
                {
                    _id: posupplierstatus._id,
                    parentId: temp,
                    dateInserted: posupplierstatus.dateInserted,
                    insertedBy: collections[1].find(o => o._id == posupplierstatus.insertedBy),
                    poSupplierId: posupplierstatus.poSupplierId,
                    statusId: collections[3].find(o => o._id == posupplierstatus.statusId)
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

var POSupplierStatus = mongoose.model('POSupplierStatus', POSupplierStatusSchema);
module.exports = { POSupplierStatus };
