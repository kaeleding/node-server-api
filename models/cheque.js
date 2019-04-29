const
    _ = require('lodash'),
    mongoose = require('mongoose'),
    validator = require('validator'),
    { User } = require('./user');


var ChequeSchema = new mongoose.Schema({
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
    chequeNo: {
        type: String,
        required: true
    },
    poSupplierId: {
        type: String,
    },
    CRFReference: {
        type: String,
    },
    amount: {
        type: String,
        required: true
    },
    bank: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    }
});

ChequeSchema.statics.getAll = function () {
    var orig = Cheque.find();
    var user = User.getAll();

    return Promise.all([orig, user]).then(collections => {
        var data = [];

        collections[0].forEach((el) => {
            //this is to insert a value to parentId if it's null or undefined
            temp = el.parentId == null || el.parentId == undefined ? el._id : el.parentId;
            data.push(
                {
                    _id: el._id,
                    parentId: temp,
                    dateInserted: el.dateInserted,
                    chequeNo: el.chequeNo,
                    poSupplierId: el.POSupplierId,
                    CRFReference: el.CRFReference,
                    amount: el.amount
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

var Cheque = mongoose.model('Cheque', ChequeSchema);
module.exports = { Cheque };
