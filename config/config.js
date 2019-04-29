var env = process.env.NODE_ENV || 'development';
console.log('env *****', env);

// checks whether the running environment is for development or test

if (env === "development" || env === "test") {
    // creates a database
    var config = require('./config-local.json'),
        env = config[env],
        result = {

            PORT: undefined,
            MONGODB_URI: undefined,
            JWT_SECRET: 'abc123!',
            TOKEN_KEY: 'x-auth'
        };

    Object.keys(result).forEach(key => {

        if (env[key]) {

            result[key] = env[key];
        }
    });

    process.env = result;
}

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = {

    mongoClient: require('mongodb').MongoClient.connect(process.env.MONGODB_URI)
}