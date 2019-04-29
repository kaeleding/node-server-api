const
    _ = require('lodash'),
    mongoose = require('mongoose'),
    validator = require('validator'),
    { User } = require('./user'),
    { Material } = require('./material'),
    { MaterialStock } = require('./materialstock'),
    { Supplier } = require('./supplier');



var PRFSchema = new mongoose.Schema({
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
    isApproved: {
        type: Boolean
    },
    quantity: {
        type: Number
    },
    materialId: {
        type: String
    },
    supplierId: {
        type: String
    },
    acquisition: {
        type: Number
    },
    remarks: {
        type: String
    },
    projectId: {
        type: String
    },
    isPO: {
        type: Boolean
    },
    CRFnumber: {
        type: String
    },
    POnumber: {
        type: String
    }
    // CRF/PO Number??
});

PRFSchema.statics.getAll = function () {
    var prf = PRF.find();
    var user = User.getAll();
    var material = Material.getAll();
    var supplier = Supplier.getAll();
    var matstock = MaterialStock.getAll();

    return Promise.all([prf, user, material, supplier, matstock]).then(collections => {
        var data = [];

        collections[0].forEach((prf) => {
            //this is to insert a value to parentId if it's null or undefined
            temp = prf.parentId == null || prf.parentId == undefined ? prf._id : prf.parentId;
            mats = collections[4].find(o => o.materialId == prf.materialId);
            inStock = mats != undefined && mats.stock != undefined && mats.stock != null && mats.stock > 0;
            stock = inStock ? mats.stock : 0;
            data.push(
                {

                    _id: prf._id,
                    dateInserted: prf.dateInserted,
                    insertedBy: collections[1].find(o => o._id == prf.insertedBy),
                    isApproved: prf.isApproved,
                    projectId: prf.projectId,
                    parentId: temp,
                    qty: prf.quantity,
                    unit: prf.unit,
                    material: collections[2].find(o => o._id == prf.materialId),
                    inStock: inStock,
                    stock: stock
                    // supplierId: collections[3].find(o => o._id == prf.supplierId),
                    // onStock: prf.onStock,
                    // order: prf.order,
                    // remarks: prf.remarks,
                    // projectId: prf.projectId,
                    // isCRFOrPO: prf.isCRFOrPO,
                    // CRFNumber: prf.CRFNumber,
                    // PONumber: prf.PONumber
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

var PRF = mongoose.model('PRF', PRFSchema);
module.exports = { PRF };
