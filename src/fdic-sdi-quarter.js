'use strict';
var path = require('path');
var fs = require('fs');
var config = require('config');
var Datastore = require('nedb')
var FileHandler = require('./file-handler.js');
var QDate = require('./q-date')


//var fdicSdiQuarter=co(fdicSdiQuarter_factory(qdate));

module.exports = function *FdicSdiQuarter_factory(options) {
    const date = new Date();
    try {
        options = resolveOptions(options)
        var fdicSdiQuarter = new FdicSdiQuarter(options.yyyy, options.quarter);

        //FILL ASYNC PROPERTIES FOR THIS INSTANCE
        fdicSdiQuarter.fname = yield getName('jj');


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

class FdicSdiQuarter {

    constructor(year, quarter) {

        this._qDate = new QDate(year, quarter);

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


        this._unzipped = false;

        //assume it is expanded to avoid performance hit of reading zip by default
        this._zipFileExpanded = true;


        //an array of filenames in the fdic quarter zip file
        this._csvFilenames = [];
    }


    //csv Files is a simple string array that is
    get csvFilenames() {
        //console.log('this._csvFilenames;', this._csvFilenames)
        return this._csvFilenames;

    }

    get unzipped() {
        return this._unzipped;
    }


    get fname() {
        return this._fname;
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
