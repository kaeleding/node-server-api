const
    _ = require('lodash'),
    mongoose = require('mongoose'),
    validator = require('validator');


var EmailSchema = new mongoose.Schema({
    sequence: {
        type: Number,
        // required: true
    },
    inboxId: {
        type: String,
        required: true
    }
});

EmailSchema.statics.getAll = function () {
    Email.find();
}
// http://mongoosejs.com/docs/guide.html - for mongoose api

var Email = mongoose.model('Email', EmailSchema);
module.exports = { Email };
