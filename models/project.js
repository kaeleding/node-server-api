const
    _ = require('lodash'),
    mongoose = require('mongoose'),
    validator = require('validator'),
    { User } = require('./user'),
    { ProjectContact } = require('./projectcontact'),
    { PRF } = require('./prf'),
    { ProjectStatus } = require('./projectstatus'),
    { PRFStatus } = require('./prfstatus'),
    { Design } = require('./design');


var ProjectSchema = new mongoose.Schema({
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
    clientId: {
        type: String,
    },
    designRemarks: {
        type: String
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    remarks: {
        type: String
    },
    hasPOC: {
        type: Boolean,
        default: false,
    },
    isDraft: {
        type: Boolean,
        default: false,
    },
    email: {
        type: String,
        default: false,
        required: true,
        validate: {
            validator: value => {
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    paymentTerms: {
        type: String,
        required: true,
    }
});

// http://mongoosejs.com/docs/guide.html - for mongoose api

ProjectSchema.statics.getAll = function () {
    var proj = Project.find();
    var user = User.getAll();
    var projcont = ProjectContact.getAll();
    var desi = Design.getAll();
    var prf = PRF.getAll();
    var stat = ProjectStatus.getAll();
    var statprf = PRFStatus.getAll();


    return Promise.all([user, proj, projcont, desi, prf, stat, statprf]).then(collections => {
        var data = [];

        collections[1].forEach((el) => {
            //this is to insert a value to parentId if it's null or undefined
            temp = el.parentId == null || el.parentId == undefined ? el._id : el.parentId;
            cust = (collections[2].find(o => o.projectId == el._id)).contactId;
            data.push(
                {
                    id: el._id,
                    parentId: temp,
                    timestamp: el.dateInserted,
                    salesAgent: collections[0].find(o => o._id == el.insertedBy),
                    CustomerInformation: {
                        company: cust.clientId,
                        email: cust.email,
                        fullname: cust.name,
                        mobileNumber: cust.mobile,
                        phoneNumber: cust.phone
                    },
                    remarks: el.remarks,
                    hasPO: el.hasPOC,
                    isDraft: el.isDraft,
                    email: el.email,
                    paymentTerms: el.paymentTerms,
                    DesignRequirements: {
                        list: collections[3].filter(o => o.projectId == el._id),
                        remarks: el.designRemarks,
                        startDate: el.startDate
                    },
                    Materials: collections[4].filter(o => o.projectId == el._id),
                    StatusDetails: collections[5].find(o => o.projectId == el._id),
                    PRF: {
                        StatusDetails: collections[6].find(o => o.projectId == el._id),
                        list: collections[4].filter(o => o.projectId == el._id)
                    }
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

var Project = mongoose.model('Project', ProjectSchema);
module.exports = { Project };
