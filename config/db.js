const
    _ = require('lodash'),
    { ObjectID } = require('mongodb'),
    { User } = require('../models/user'),
    { mongoClient } = require('../config/config');

console.log('db');
    
var db = (() => {

    return {

        upsert: (collection, body, id) => {

            id = !id ? new ObjectID() : ObjectID(id);

            var promise = new Promise((resolve, reject) => {

                body = _.omit(body, ['_id']);

                if (_.isEmpty(body)) {

                    return reject({ status: 400, message: 'body must not be empty' });
                }

                if (!ObjectID.isValid(id)) {

                    return reject({ status: 400, message: 'ObjectID is of incorrect format/type' });
                }

                mongoClient
                    .then(db => {

                        db.collection(collection)
                            .findOneAndUpdate(
                            { _id: id },
                            { $set: body },
                            { upsert: true, returnOriginal: false }
                            )
                            .then(pingBack => {

                                if (pingBack.lastErrorObject && pingBack.lastErrorObject.n === 0) {

                                    return reject({ status: 404, message: "nothing was updated" });
                                }

                                resolve(pingBack.value);
                            });

                    })
                    .catch(err => reject({ status: 500, message: err }));

            });

            return promise;
        },

        delete: (collection, query) => {

            var promise = new Promise((resolve, reject) => {

                if (_.isEmpty(query)) {

                    return reject({ status: 500, message: 'Body/query for deletion must not be empty' });
                };

                mongoClient
                    .then(db => {

                        db.collection(collection)
                            .remove(query)
                            .then(pingBack => {

                                if (pingBack.result && pingBack.result.n === 0) {

                                    return reject({ status: 404, message: 'Object to delete was not found' });
                                }

                                resolve(pingBack);
                            });
                    })
                    .catch(err => reject({ status: 500, message: err }));
            });

            return promise;
        },

        getMany: (collection, query) => {

            var promise = new Promise((resolve, reject) => {

                mongoClient
                    .then(function (db) {

                        db.collection(collection)
                            .find(query)
                            .toArray()
                            .then(pingback => {

                                resolve(pingback);
                            });
                    })
                    .catch(err => reject({ status: 500, message: err }));
            });

            return promise;
        },

        getOne: (collection, id) => {

            var promise = new Promise((resolve, reject) => {

                if (!ObjectID.isValid(id)) {

                    return reject({ status: 404, message: 'Invalid ObjectID' })
                }

                var query = {
                    _id: ObjectID(id)
                };

                mongoClient
                    .then(db => {

                        db.collection(collection)
                            .findOne(query)
                            .then(result => {

                                if (!result) {

                                    return reject({ status: 404, message: 'None found' });
                                }

                                resolve(result);
                            });
                    })
                    .catch(err => reject({ status: 500, message: err }));

            });

            return promise;
        }

    }
})();
console.log('db end');
module.exports = { db };
