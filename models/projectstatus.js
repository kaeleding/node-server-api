const
    _ = require('lodash'),
    mongoose = require('mongoose'),
    validator = require('validator'),
    { RefStatusProject } = require('./ref_statusproject'),
    { User } = require('./user');


var ProjectStatusSchema = new mongoose.Schema({
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
    projectId: {
        type: String,
        required: true
    },
    statusCode: {
        type: Number,
        required: true
    }
});

ProjectStatusSchema.statics.getAll = function () {
    var projstat = ProjectStatus.find();
    var user = User.getAll();
    var stat = RefStatusProject.getAll();

    return Promise.all([projstat, user, stat]).then(collections => {
        var data = [];

        collections[0].forEach((el) => {
            data.push(
                {
                    _id: el._id,
                    dateInserted: el.dateInserted,
                    insertedBy: collections[1].find(o => o._id == el.insertedBy),
                    projectId: el.projectId,
                    statusCode: collections[2].find(o => o.code == el.statusCode)
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
            return JSON.stringify(v.projectId);
        });

        return data;
    });
}

// http://mongoosejs.com/docs/guide.html - for mongoose api

var ProjectStatus = mongoose.model('ProjectStatus', ProjectStatusSchema);
module.exports = { ProjectStatus };
