'use strict';
var path = require('path');
var fs = require('fs');
var config = require('config');
var Datastore = require('nedb')
var FileHandler = require('./file-handler.js');
var QDate = require('./q-date')


//var fdicSdiQuarter=co(fdicSdiQuarter_factory(qdate));
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
    const date = new Date();
    try {
        options = resolveOptions(options)
        var fdicSdiQuarter = new FdicSdiQuarter(options.yyyy, options.quarter);
        //console.log(fdicSdiQuarter)
        //FILL ASYNC PROPERTIES FOR THIS INSTANCE
        fdicSdiQuarter.fname = yield getName('jj');
        fdicSdiQuarter._successfulActions = yield hydrateSuccessfullActions(options.yyyy, options.quarter);

        //console.log(fdicSdiQuarter)
        return fdicSdiQuarter;

    }
    catch (e) {
        console.log("IN ERROR ", e)
    }
};

function resolveOptions(options) {
    options = options === undefined ? {} : options;
    options.yyyy = options.yyyy === undefined ? date.getFullYear() : options.yyyy;
    options.quarter = options.quarter === undefined ? 1 : options.quarter;
    options.qdate = options.qdate === undefined ? new QDate(options.yyyy, options.quarter) : options.qdate;
    if (options.qdate.isValid) {
        return options;
    }
    else {
        throw 'qdate is invalid'
    }
}

function getName(name) {
    var p = new Promise(function (resolve, rej) {
        setTimeout(function () {
            resolve(name)
        }, 2000)

    });
    return p;
}

const _filnames = ['a', 'b']
class FdicSdiQuarter {

    constructor(year, quarter) {
        this._year = year;
        this._quarter = quarter;
        this._qDate = new QDate(year, quarter);
        this._successfulActions = [];


        this._unzipped = false;

        //assume it is expanded to avoid performance hit of reading zip by default
        this._zipFileExpanded = true;


        //an array of filenames in the fdic quarter zip file
        this._csvFilenames = [];
    }

    getSuccessfulAction(actionName) {
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
        persistSuccessfulActions(this._successfulActions,this._year, this._quarter);
    }


    //csv Files is a simple string array that is
    get csvFilenames() {
        console.log('this._csvFilenames;', this._csvFilenames)
        return this._csvFilenames;
    }

    get unzipped() {
        return this._unzipped;
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

    get stage1Location() {
        return config.stage1Location
    }

    get stage2Location() {
        return config.stage2Location
    }

    get stage1Filename() {
        return path.join(this.stage1Location, '/All_Reports_' + this._qDate.string + '.zip')
    }

    get stage1FileExists() {
        try {
            fs.statSync(this.stage1Filename);
            return true;
        }
        catch (err) {
            return false
        }
        return false;
    }
}


function extractZip(force) {
    //This is inherently an async operation
    if (force) {
        FileHandler.extractZippedFiles(this.stage1Filename, this.stage2Location).then(function (one, result) {
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
 * If there have been successfull actions persisted, then return them as an array
 * @param year
 * @param quarter
 */
function hydrateSuccessfullActions(year, quarter) {
    const dbfile = path.resolve(`${config.appDataLocation}/sdiSuccessfulActions_${year}_q${quarter}.db`)
    console.log(dbfile)
    let p = new Promise(function(resolve, reject){

        var db = new Datastore({
            filename: dbfile,
            autoload: false,
            timestampData: true
        });

        db.loadDatabase(function (err) {    // Callback is optional

        });
        db.find({}, function (err, docs) {
            if (docs) {
                console.log(docs.length)
                resolve(docs)
            }
            if (err) {
                throw err
            }
        });
    });
    return p;
}

function persistSuccessfulActions(successfullActionsArray,year, quarter) {
    const dbfile = path.resolve(`${config.appDataLocation}/sdiSuccessfulActions_${year}_q${quarter}.db`)
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