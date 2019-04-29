const
    _ = require('lodash'),
    mongoose = require('mongoose'),
    validator = require('validator'),
    { User } = require('./user');


var SupplierSchema = new mongoose.Schema({
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
    name: {
        type: String
    },
    address: {
        type: String
    },
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: value => {
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    phone: {
        type: String
    },
    mobile: {
        type: String
    }
});

// http://mongoosejs.com/docs/guide.html - for mongoose api

SupplierSchema.statics.getAll = function () {
    var supplier = Supplier.find();
    var user = User.getAll();

    return Promise.all([supplier, user]).then(collections => {
        var data = [];

        collections[0].forEach((supplier) => {
            //this is to insert a value to parentId if it's null or undefined
            temp = supplier.parentId == null || supplier.parentId == undefined ? supplier._id : supplier.parentId;
            data.push(
                {
                    _id: supplier._id,
                    dateInserted: supplier.dateInserted,
                    parentId: temp,
                    insertedBy: collections[1].find(o => o._id == supplier.insertedBy),
                    name: supplier.name,
                    address: supplier.address,
                    email: supplier.email,
                    phone: supplier.phone,
                    mobile: supplier.mobile
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


var Supplier = mongoose.model('Supplier', SupplierSchema);
module.exports = { Supplier };
