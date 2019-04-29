const
    _ = require('lodash'),
    mongoose = require('mongoose'),
    validator = require('validator'),
    { User } = require('./user'),
    { Revision } = require('./revision'),
    { DesignStatus } = require('./designstatus'),
    { Project } = require('./project');


var DesignSchema = new mongoose.Schema({
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
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    remarks: {
        type: String
    },
    finalLink: {
        type: String
    }
});

DesignSchema.statics.getAll = function () {
    var orig = Design.find();
    var user = User.getAll();
    var revi = Revision.getAll();
    var stat = DesignStatus.getAll();

    return Promise.all([orig, user, revi, stat]).then(collections => {
        var data = []
        collections[0].forEach((el) => {
            //this is to insert a value to parentId if it's null or undefined
            temp = el.parentId == null || el.parentId == undefined ? el._id : el.parentId;
            data.push({
                _id: el._id,
                parentId: temp,
                dateInserted: el.dateInserted,
                insertedBy: collections[1].find(o => o._id == el.insertedBy),
                projectId: el.projectId,
                type: el.type,
                size: el.size,
                budget: el.budget,
                location: el.location,
                remarks: el.remarks,
                status: collections[3].find(o => o.designId == el._id),
                finalLink: el.finalLink,
                revision: collections[2].filter(o => o.designId == el._id)
            })
        })

        // this is to sort the data descending by dateInserted

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
    })
}
// http://mongoosejs.com/docs/guide.html - for mongoose api

var Design = mongoose.model('Design', DesignSchema);
module.exports = { Design };
