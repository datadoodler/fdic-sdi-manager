'use strict';
const path = require('path');
const config = require('config');
var Datastore = require('nedb');
const logger = require('./logger');


getPersistedSuccessfulActions(2012,1);
function getPersistedSuccessfulActions(year, quarter) {
    const dbfile = path.resolve(`${config.appDataLocation}/${year}_q${quarter}/sdiSuccessfulActions_${year}_q${quarter}.db`);

    let p = new Promise(function (resolve, reject) {

        var db = new Datastore({
            filename: dbfile,
            autoload: false,
            timestampData: true
        });
console.log(db)
        db.loadDatabase(function (err) {    // Callback is optional

        });
        db.find({}, function (err, docs) {
            if (docs) {
                //console.log(docs.length)
                resolve(docs)
            }
            if (err) {
                throw err
            }
        });
    });
    return p;
};


function persistSuccessfulActions(successfullActionsArray, year, quarter) {
    const dbfile = path.resolve(`${config.appDataLocation}/${year}_q${quarter}/sdiSuccessfulActions_${year}_q${quarter}.db`)
    var db = new Datastore({
        filename: dbfile,
        autoload: false,
        timestampData: true
    });

    db.loadDatabase(function (err) {    // Callback is optional

    });
    db.insert(successfullActionsArray, function (err, newDocs) {
    })
}



module.exports={
    getPersistedSuccessfulActions,
    persistSuccessfulActions
};