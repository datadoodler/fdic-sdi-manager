'use strict';
const path = require('path');
const config = require('config');
var Datastore = require('nedb');
const logger = require('./logger.js');
var fdicSdiQuarter = require('./fdic-sdi-quarter.js');

//getPersistedSuccessfulActions(2012, 1);
function getPersistedSuccessfulActions(year, quarter) {
    const dbfile = path.resolve(`${config.appDataLocation}/${year}_q${quarter}/sdiSuccessfulActions_${year}_q${quarter}.db`);

    let p = new Promise(function (resolve, reject) {

        var db = getLocalState_SuccessfulActions(year, quarter);
        //console.log(db)

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

function getLocalState_SuccessfulActions(year, quarter) {
    var db = new Datastore({
        filename: path.join(getLocalStateFolder(year, quarter), '/localState_SuccessfulActions.db'),
        autoload: false,
        timestampData: true
    });
    //console.log(db)
    db.loadDatabase(function (err) {
        logger.error(err)
    });
    return db;
}


function persistSuccessfulActions(successfullActionsArray, year, quarter) {
    var db = getLocalState_SuccessfulActions(year,quarter)


    db.insert(successfullActionsArray, function (err, newDocs) {
    })
}

/**
 *
 * @returns {Datastore}
 * @param year
 * @param quarter
 */
function getLocalState_CsvMetadata(year, quarter) {
    //console.log(year,quarter)
    var db = new Datastore({
        filename: path.join(fdicSdiQuarter.getLocalStateFolder(year, quarter), '/localState_CsvFiles.db'),
        autoload: false,
        timestampData: true
    });
    //console.log(db)
    db.loadDatabase(function (err) {
        logger.error(err)
    });
    return db;
}


/**
 *
 * @returns {Datastore}
 * @param year
 * @param quarter
 */
function getLocalState_CsvMetadata(year, quarter) {
    //console.log(fdicSdiQuarter)
    var db = new Datastore({
        filename: path.join(getLocalStateFolder(year, quarter), '/localState_CsvMetadata.db'),
        autoload: false,
        timestampData: true
    });
    //console.log(db)
    db.loadDatabase(function (err) {
        logger.error(err)
    });
    return db;
}

/**
 * The base folder for all nedb files for this quarter
 * @param year
 * @param quarter
 */
function getLocalStateFolder(year, quarter) {
    var appDatafolder = path.resolve(`${config.appDataLocation}/${year}_q${quarter}`);
    return appDatafolder;
}

module.exports = {
    getPersistedSuccessfulActions,
    persistSuccessfulActions,
    getLocalState_CsvMetadata,
    getLocalStateFolder
};