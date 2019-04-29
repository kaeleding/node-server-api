const
    _ = require('lodash'),
    mongoose = require('mongoose'),
    validator = require('validator'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    auth = require('../_aux/auth'),
    saltRounds = 10;

var UserSchema = new mongoose.Schema({
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
        type: String
    },
    //END of DEFAULT
    firstName: {
        type: String,
        required: true,
        minlength: 1,
    },
    lastName: {
        type: String,
        required: true,
        minlength: 1,
    },
    middleName: {
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
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.statics.getAll = function () {
    return User.find();
}

UserSchema.statics.login = function(data) {
    return User.findOne({email: data.email});
}

UserSchema.pre('save', function(next) {
    var user = this;
    user.tokens.push(auth.generateAuthToken(user));
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
        // hash the password using our new salt
        auth.hashPassword(user, (password)=>{
            user.password = password;
            next();
        });
});

UserSchema.methods.comparePassword = function(givenPassword, cb){
    bcrypt.compare(givenPassword, this.password, function(err, res) {
      cb(null,res);
    });
}

// http://mongoosejs.com/docs/guide.html - for mongoose api

var User = mongoose.model('User', UserSchema);
module.exports = { User };
