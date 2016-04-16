'use strict';
var path = require('path');
var fs = require('fs');
var config = require('config');
var Datastore = require('nedb')
var FileHandler = require('./file-handler.js');



//var fdicSdiQuarter=co(fdicSdiQuarter_factory(qdate));

module.exports = function *fdicSdiQuarter_factory(qdate) {
    var newInstance = new FdicSdiQuarter(qdate);
    newInstance.fname = yield getName('jj');
    return newInstance;
}

//export fdicSdiQuarter_factory;
function getName(name) {
    console.log('in getName', name)
    //var x = [1, 2];
    //console.log('wheres the error?',x[3].name)
    var p = new Promise(function (resolve, rej) {
        setTimeout(function () {
            console.log('leaving getName1', name)
            resolve(name)
            console.log('leaving getName2', name)
        }, 2000)

    });
    return p;
}
class FdicSdiQuarter {


    constructor(qdate) {
        this._qDate = qdate;
        this._fname = 'abc';
        // This is a good place for a generator function to initialize the object with
        // the necessary asynch operations.
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

        //nedb table for csvFiles for this quarter
        this._db_csvFiles = new Datastore({
            filename: path.join(config.appDataLocation, '/sdiCsvFiles_' + this._qDate.string + '.db'),
            autoload: false,
            timestampData: true
        });

        //nedb table for all variables in this quarter
        this._db_allVars = new Datastore({
            filename: path.join(config.appDataLocation, '/sdiAllVars_' + this._qDate.string + '.db'),
            autoload: false,
            timestampData: true
        });

        //an array of filenames in the fdic quarter zip file
        this._csvFilenames = [];
    }


    //csv Files is a simple string array that is
    get csvFilenames() {
        console.log('this._csvFilenames;', this._csvFilenames)
        return this._csvFilenames;

    }

    get unzipped() {
        return this._unzipped;
    }

    //csvFilenames(x){
    //    FileHandler.getCompressedFileNames(this.stage1Filename).then(function (result) {
    //        this._csvFilenames = result;
    //    })
    //}

    persistCsvFilenames() {
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

    upsertCsvFile(filename) {
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

    extractZip(force) {
        //This is inherently an async operation
        if (force) {
            FileHandler.extractZippedFiles(this.stage1Filename, this.stage2Location).then(function (one, result) {
                console.log('one', one);
                console.log('result', result);
            });
        }
        //console.log('FileHandler returns this', p)
        //p.then(function(result){
        //    console.log('then result',result)
        //})
        //return p;
    }
}

