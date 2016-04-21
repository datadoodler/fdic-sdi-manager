'use strict';
var path = require('path');
var fs = require('fs');
var config = require('config');
var database = require('./database');
var logger = require('./logger');
var FileHandler = require('./file-handler.js');
var QDate = require('./q-date');
console.log(database);
logger.silly('SUCCESSFULLY IMPORTED LOGGER');
/**
 * Things that need to happen
 * Check if local data is persisted for this particular quarter.
 *  * ETL state is persisted in this._db_etlState
 *      - if it doesn't exist, create it and initialize properties as non-persisted value
 *      - csvFilesArePersisted (bool)
 *      - allVarsArePersisted (bool)
 *  * List of CSV filenames along with various metadata (creation/extraction dates, size)
 *      - this is held in this._db_csvFiles
 *      - if this is
 *  * List of all vars along with various metadata (file, varname, type, [max,min,avg,kurtosis,...]
 *      - this is held in this._db_allVars
 *      - (this may be deleted after the distinctVars table is created)
 *  * List of distinct vars
 *      - this is held in this._db_distinctVars
 *
 */

module.exports = function *FdicSdiQuarter_factory(options) {
    logger.info("in fdicsdiqΩΩuarter generator with options before",options)
    const date = new Date();
    try {
        options = resolveOptions(options);

        var fdicSdiQuarter = new FdicSdiQuarter(options.year, options.quarter);

        // GET INITIAL STATE - FILL ASYNC PROPERTIES FOR THIS INSTANCE
        fdicSdiQuarter.fname = yield getName('jj');

        fdicSdiQuarter._successfulActions = yield database.getPersistedSuccessfulActions(options.year, options.quarter);

        //fdicSdiQuarter._csvFileMetadata = yield getCsvFileMetadata(options.year, options.quarter);

        return fdicSdiQuarter;

    }
    catch (e) {
        console.error("SOME ASYNC FUNCTION IN FdicSdiQuarter_factory GENERATOR", e)
    }
};



class FdicSdiQuarter {

    constructor(year, quarter) {
        this._year = year;
        this._quarter = quarter;
        this._qDate = new QDate(year, quarter);

        /*
         --Actions
         zipFileExists
         zipFileExpanded
         csvFilesTableFilled
         allVarsMetadataTableFilled
         distinctVarsMetadataTableFilled
         variablePersisted(varName)
         */
        this._successfulActions = [];

        this._stage1FileExists = true;

        //assume it is expanded to avoid performance hit of reading zip by default
        this._zipFileExpanded = true;


        //an array of filenames in the fdic quarter zip file
        this._csvFileMetadata = [];
    }

    getSuccessfullAction(actionName) {
        return this._successfulActions.find(x=>x.key == actionName);
    }

    setSuccessfulAction(actionName) {
        const idx = this._successfulActions.findIndex(x=>x.key == actionName);
        if (idx > -1) {
            this._successfulActions.splice(idx);
        }
        const dt = new Date();
        const newObj = {key: actionName, dateComplete: dt.toString()};
        this._successfulActions.push(newObj);
        database.persistSuccessfulActions(this._successfulActions, this._year, this._quarter);
    }


    //csv Files is a simple string array that is
    get csvFileMetadata() {
        //console.log('this._csvFilenames;', this._csvFileMetadata)
        return this._csvFileMetadata;
    }


    get fname() {
        return 'k' + this._fname;
    }

    set fname(name) {
        this._fname = name;
    }

    get qDate() {
        return this._qDate;
    }

    get zipFileExpanded() {
        return this._zipFileExpanded;
    }

    get stage1Filename() {
       // return path.join(this.stage1Location, '/All_Reports_' + this._qDate.string + '.zip')
        return path.join(config.stage1Location, '/All_Reports_' + this._qDate.string + '.zip')

    }

    get stage1FileExists() {
        return this._stage1FileExists
    }

    set stage1FileExists(val) {
        this._stage1FileExists = val;
    }
}





function resolveOptions(options) {
    options = options === undefined ? {} : options;
    options.year = options.year === undefined ? date.getFullYear() : options.year;
    options.quarter = options.quarter === undefined ? 1 : options.quarter;
    options.qdate = options.qdate === undefined ? new QDate(options.year, options.quarter) : options.qdate;
    if (options.qdate.isValid) {
        return options;
    }
    else {
        throw 'qdate is invalid'
    }
}


function extractZip(force) {
    //This is inherently an async operation
    if (force) {
        FileHandler.extractZippedFiles(this.stage1Filename)
            .then(function (one, result) {
            console.log('result', result);
        });
    }
}

function persistCsvFilenames() {
    var p = FileHandler.getCompressedFileNames(this.stage1Filename)
        .then(function (result) {
            for (let i = 0; i < result.length; i++) {
                let record = {filename: result[i]};
                //console.log(record);
                this.upsertCsvFile(result[i]);
                //this.csvFiles.insert(record, function (err,newDoc) {
                //    console.log(err,newDoc)
                //});
            }
        }.bind(this));
    //this.db_csvFiles.insert({test: "abc"})
}

function upsertCsvFile(filename) {
    let query = {
        filename: filename
    };
    let update = {
        filename: filename
    };
    let options = {
        upsert: true
    };
    let callback = function (err, numAffected, affectedDocuments, upsert) {
        console.log('err', err, 'numAffected', numAffected, 'affectedDocuments', affectedDocuments, 'upsert', upsert)
    };

    this.csvFiles.update(query, update, options, callback);

    //this.csvFiles.find(query,function(err,docs){
    //    console.log('found ',docs)
    //})

}


//EXPECT A PERFORMANCE HIT FOR EXTRACTING THE ZIP FILE THE FIRST TIME FUNCTION RUNS
function getCsvFileMetadata(year,quarter) {
    const dbfile = path.resolve(`${config.appDataLocation}/sdiCsvFileMeta_${year}_q${quarter}.db`)
    //console.log(dbfile)
    let p = new Promise(function (resolve, reject) {

        //FIRST, SEARCH FOR PERSISTED METADATA IN DATABASE
        var db = new Datastore({
            filename: dbfile,
            autoload: false,
            timestampData: true
        });

        db.loadDatabase(function (err) {
            console.log(err)
        });
        db.find({}, function (err, docs) {
            //METADATA FOUND IN DATABASE
            if (docs && docs.length > 0) {
                //console.log(docs.length)
                resolve(docs)
            }
            //METADATA NOT FOUND IN DATABASE, EXTRACT CSV FILE
            if (docs && docs.length === 0) {
                //console.log(docs.length)
                resolve(docs)
            }
            if (err) {
                throw err
                resolve(false)
            }
        });

    })
    return p
}
//nedb table for csvFiles for this quarter
function getCsvFilesDataStore(qdate) {
    return new Datastore({
        filename: path.join(config.appDataLocation, '/sdiCsvFiles_' + qdate.string + '.db'),
        autoload: false,
        timestampData: true
    });
}


//nedb table for all variables in this quarter
function getAllVarsDataStore(qdate) {
    return new Datastore({
        filename: path.join(config.appDataLocation, '/sdiAllVars_' + qdate.string + '.db'),
        autoload: false,
        timestampData: true
    });
}


/**
 * If there have been successful actions persisted, then return them as an array
 * @param year
 * @param quarter
 */


function getName(name) {
    var p = new Promise(function (resolve, rej) {
        setTimeout(function () {
            resolve(name)
        }, 2000)

    });
    return p;
}