const
    _ = require('lodash'),
    mongoose = require('mongoose'),
    validator = require('validator'),
    { Client } = require('./client'),
    { User } = require('./user');


var ContactSchema = new mongoose.Schema({
    //DEFAULT
    parentId: {
        type: String
    },
    dateInserted: {
        type: Date,
        required: true,
        default: Date.now,
    },
    insertedBy: {
        type: String,
        required: true
    },
    //END of DEFAULT
    clientId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        minlength: 2,
        trim: true,
        unique: true,
        validate: {
            validator: value => {
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    name: {
        type: String
    },
    mobile: {
        type: String
    },
    phone: {
        type: String
    }
});

ContactSchema.statics.getAll = function () {
    var orig = Contact.find();
    var user = User.getAll();
    var clie = Client.getAll();
    return Promise.all([orig, user, clie]).then(collections => {
        var data = [];

        collections[0].forEach((el) => {
            //this is to insert a value to parentId if it's null or undefined
            temp = el.parentId == null || el.parentId == undefined ? el._id : el.parentId;
            data.push(
                {
                    _id: el._id,
                    parentId: temp,
                    dateInserted: el.dateInserted,
                    insertedBy: collections[1].find(o => o._id == el.insertedBy),
                    clientId: collections[2].find(o => o._id == el.clientId).company,
                    email: el.email,
                    name: el.name,
                    mobile: el.mobile,
                    phone: el.phone
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

var Contact = mongoose.model('Contact', ContactSchema);
module.exports = { Contact };
