
const 
    express = require('express');
    router = express.Router();
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    saltRounds = 10;

module.exports = {

  generateAuthToken : function(user){ //TODO: change 'abc123' value to a longer illegible string value
    const hexString = user._id.toString();

    var access = 'auth',
    token = jwt.sign({ _id: hexString, access}, 'abc123').toString();

    var data = {
      access : access,
      token: token
    }
    return data;
  },

  hashPassword : function(user, callback){
    var userPass;
    bcrypt.genSalt(10, (err, salt) => {
      if(err) return callback(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
          if(err) return callback(err);
            user.password = hash;
            callback(user.password);
        })
    });

    return userPass;
  },

  checkPassword : function(rawPass, hash, callback){
    var result;
    bcrypt.compare(rawPass, hash, function(err, res) {
      callback(res);
    });
    return result
  }
}
  