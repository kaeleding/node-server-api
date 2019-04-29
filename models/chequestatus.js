const
    _ = require('lodash'),
    mongoose = require('mongoose'),
    validator = require('validator'),
    { User } = require('./user');


var ChequeStatusSchema = new mongoose.Schema({
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
    chequeId: {
        type: String,
        required: true
    },
    statusCode: {
        type: Number,
        required: true
    }
});

ChequeStatusSchema.statics.getAll = function () {
    var orig = ChequeStatus.find();
    var user = User.getAll();

    return Promise.all([orig, user]).then(collections => {
        var data = [];

        collections[0].forEach((el) => {
            data.push(
                {
                    _id: el._id,
                    dateInserted: el.dateInserted,
                    insertedBy: collections[1].find(o => o._id == el.insertedBy),
                    chequeId: el.chequeId,
                    statusCode: el.statusCode
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

var ChequeStatus = mongoose.model('ChequeStatus', ChequeStatusSchema);
module.exports = { ChequeStatus };
