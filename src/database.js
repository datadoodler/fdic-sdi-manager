'use strict';
const path = require('path');
const config = require('config');
var Datastore = require('nedb');
const logger = require('./logger.js');
var fdicSdiQuarter = require('./fdic-sdi-quarter.js');

//getPersistedSuccessfulActions(2012, 1);
function getPersistedSuccessfulActions(year, quarter) {
    const dbfile = path.resolve(`${config.applicationStateLocation}/${year}_q${quarter}/sdiSuccessfulActions_${year}_q${quarter}.db`);
    //console.log('dbfile', `${path.basename(__filename)} - getPersistedSuccessfulActions -`,dbfile)

    let p = new Promise(function (resolve, reject) {

        var db = getLocalState_SuccessfulActions(year, quarter);
        //console.log(db)

        db.find({}, function (err, docs) {
            if (docs) {
                //console.log(docs.length)
                resolve(docs)
            }
            if (err) {
                reject(err)
            }
        });
    });
    return p;
};

function getLocalState_SuccessfulActions(year, quarter) {
    var db = new Datastore({
        filename: path.join(getLocalStateFolder(year, quarter), '/successfulActions.db'),
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
    var db = getLocalState_SuccessfulActions(year, quarter)


    db.insert(successfullActionsArray, function (err, newDocs) {
    })
}


/**
 *
 * @returns {Datastore}
 * @param year
 * @param quarter
 */

//getLocalState_CsvMetadata(2008,4)
function getLocalState_CsvMetadata(year, quarter) {
    var dbfile = path.join(getLocalStateFolder(year, quarter), 'csvMetadata.db');
    //var dbfile =  '/Users/kdm/DoodleZone/bankerdoodle/fdic-sdi-manager/application-state/2008_q1/localState_CsvMetadata2.db';
    //console.log('dbfile',dbfile)
    var db = new Datastore({
        filename: dbfile,
        autoload: true,
        timestampData: true
    });
    return db;
}

function getColumnArrayDb(csvFilePath) {
    var dbfile = `${path.dirname(csvFilePath)}/${path.basename(csvFilePath, '.db')}_ColumnArray.db`;
    var db = new Datastore({
        filename: dbfile,
        autoload: true,
        timestampData: true
    });
    return db;
}
function getOriginalShapeDb(csvFilePath) {
    var dbfile = `${path.dirname(csvFilePath)}/${path.basename(csvFilePath, '.db')}_OriginalShape.db`;
    var db = new Datastore({
        filename: dbfile,
        autoload: true,
        timestampData: true
    });
    return db;
}
/**
 * The base folder for all nedb files for this quarter
 * @param year
 * @param quarter
 */
function getLocalStateFolder(year, quarter) {
    var appDatafolder = path.resolve(`${config.applicationStateLocation}/${year}_q${quarter}`);
    return appDatafolder;
}

module.exports = {
    getPersistedSuccessfulActions,
    persistSuccessfulActions,
    getLocalState_CsvMetadata,
    getLocalStateFolder,
    getOriginalShapeDb,
    getColumnArrayDb
};