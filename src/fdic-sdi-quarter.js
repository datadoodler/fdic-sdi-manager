'use strict';
var path = require('path');
var fs = require('fs');
var config = require('config');
var database = require('./database');
var logger = require('./logger');
var FileHandler = require('./file-handler.js');
var QDate = require('./q-date');
let Converter = require("csvtojson").Converter;

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


function* fdicSdiQuarter_factory(options) {

    const date = new Date();

    try {
        options = resolveOptions(options);
        //console.log(options)
        var fdicSdiQuarter = new FdicSdiQuarter(options.year, options.quarter);
        var x = {}
        // GET INITIAL STATE - FILL ASYNC PROPERTIES FOR THIS INSTANCE


        fdicSdiQuarter._stage1FileExists = yield FileHandler.fileExistsPromise(fdicSdiQuarter.stage1Filename);
        //fdicSdiQuarter._successfulActions = yield database.getPersistedSuccessfulActions(options.year, options.quarter);
        //console.log(fdicSdiQuarter._successfulActions);
        fdicSdiQuarter._csvFileMetadata = yield getPersistedCsvFileMetadata(options.year, options.quarter);
        console.log(fdicSdiQuarter._csvFileMetadata.length);
        console.log(fdicSdiQuarter.stage1FileExists)
        if (fdicSdiQuarter._csvFileMetadata.length === 0 && fdicSdiQuarter.stage1FileExists) {
            fdicSdiQuarter._csvFileMetadata = yield extractZipAndPersistMetadata(fdicSdiQuarter.stage1Filename, getCsvFolder(options.year, options.quarter), options.year, options.quarter)
            //console.log(fdicSdiQuarter._csvFileMetadata.length)
            var msg = "placeholder"
            //msg = yield convertCsvFilesToDatabase(fdicSdiQuarter._csvFileMetadata,options.year,options.quarter)
            console.log('msg', msg)
            //fdicSdiQuarter._csvFileMetadata.forEach(function (csvMetaRecord) {
            //    console.log(csvMetaRecord)
            //    //msg = yield convertCsvToDatabase(csvMetaRecord)
            //    console.log(msg)
            //})
        }
        return fdicSdiQuarter;
    }

    catch (e) {
        logger.error("SOME ASYNC FUNCTION IN FdicSdiQuarter_factory GENERATOR", e)
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
        //this._successfulActions = [];

        this._stage1FileExists;

        //assume it is expanded to avoid performance hit of reading zip by default
        this._zipFileExpanded;


        //an array of filenames in the fdic quarter zip file
        this._csvFileMetadata = [];
    }

    // I don't think we need successfullActions property at all
    //getSuccessfullAction(actionName) {
    //    return this._successfulActions.find(x=>x.key == actionName);
    //}
    //setSuccessfulAction(actionName) {
    //    const idx = this._successfulActions.findIndex(x=>x.key == actionName);
    //    if (idx > -1) {
    //        this._successfulActions.splice(idx);
    //    }
    //    const dt = new Date();
    //    const newObj = {key: actionName, dateComplete: dt.toString()};
    //    this._successfulActions.push(newObj);
    //    database.persistSuccessfulActions(this._successfulActions, this._year, this._quarter);
    //}


    //csv Files is a simple string array that is
    get csvFileMetadata() {
        //console.log('this._csvFilenames;', this._csvFileMetadata)
        return this._csvFileMetadata;
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


function extractZipAndPersistMetadata(filename, destinationFolder, year, quarter) {
    console.log('filename', filename, destinationFolder)
    destinationFolder = destinationFolder || getCsvFolder(year, quarter);
    let p = new Promise(function (resolve, reject) {
        var extractPromise = FileHandler.extractZippedFiles(filename, destinationFolder);
        console.log(destinationFolder);

        extractPromise.then(function (csvMetadataRecords, err) {
            if (err) {
                console.log(err)
                throw err
            }
            console.log('csvMetadataRecords.length after extraction, before upsert', csvMetadataRecords.length)
            upsertCsvMetadata(csvMetadataRecords, year, quarter, function () {
                console.log('upsert callback, about to call convertcsvFilesToDatwabase')
                convertCsvFilesToDatabase(csvMetadataRecords, year, quarter, function (result) {
                    resolve(result)
                })
            })
        });
    });
    return p;
}

function persistCsvFileMetadata(metadataRecords, year, quarter) {
//console.log(metadata)
    for (let i = 0; i < metadataRecords.length; i++) {
        upsertCsvMetadata(metadataRecords[i], year, quarter);
    }
}

function convertCsvFilesToDatabase(csvFileRecords, year, quarter, cb) {
    //cb('ha ha - just kidding')
    console.log('csvFileRecords.length in convertCsvFilesToDatabase', csvFileRecords.length)
    //console.log('csvFileRecords in convertCsvFilesToDatabase', csvFileRecords)
    var csvFolder = getCsvFolder(year, quarter);
    console.log('csvFolder', csvFolder)
    //var p1 = new Promise(function (resolve, reject) {
    let promises = []
    console.log('csvFileRecords',csvFileRecords);
    csvFileRecords.forEach(function (record) {
        console.log('xxxxxxx HERE!', record)
        let fname = record.filename;
        console.log('path.parse(fname).ext', path.parse(fname).ext)
        if (path.parse(fname).ext === '.csv') {
            console.log('\nin convertCsvFilesToDatabase- about to get ref to a promise ', fname)
            var fullName=path.join(getCsvFolder(year,quarter),fname);
            //var fullName=path.join(getCsvFolderTest(year,quarter),fname);
            promises.push(convertCsvFileToDatabase(fullName))
            console.log('in convertCsvFilesToDatabase csvFileRecords.forEach, promises', promises.length)

        }
    })
    Promise.all(promises).then(function (result) {
        console.log(promises)
        cb('all databases for all csv files create')
        // resolve('all databases for all csv files create')
    })
    //});


    //return p1;
}


function convertCsvFileToDatabase(csvFile) {
    console.log('in convertCsvFileToDatabase', csvFile)
    var p = new Promise(function (resolve, reject) {

            console.log('in convertCsvFileToDatabase Promise', csvFile)
            //console.log('in convertCsvFileToDatabase csvFile', csvFile)

            //var columArrData=__dirname+"/data/columnArray";
            let rs = fs.createReadStream(csvFile);
            //console.log(csvFile);
            let dbColumnArray = database.getColumnArrayDb(csvFile)
            let dbOriginalShape = database.getOriginalShapeDb(csvFile)
            let result = {}
            let myMap = new Map();
            let csvConverter = new Converter();

            csvConverter.on("end_parsed", function (jsonObj) {
                //console.log('xxxxxxxxx-jsonObj', jsonObj);
                //console.log("Finished parsing");
                console.log('in csvConverter.on("end_parsed",')
                let promises = []
                 myMap.forEach(function (val, key) {
                 promises[0] = new Promise(function (res, rej) {
                 //dbColumnArray.
                 res();
                 })
                 promises[1] = new Promise(function (res, rej) {
                 //dbOriginalShape.
                 res();
                 })
                 // write to ...ColumnArray.db
                 // write to ...RecordCentric.db
                 //console.log('foreach...', key, val)
                 })
                 Promise.all(promises).then(function (value) {
                 console.log('about to invoke cb in convertCsvFileToDatabase')
                 resolve('all resolve')
                 //cb();
                 })

            });

            //record_parsed will be emitted each time a row has been parsed.
            csvConverter.on("record_parsed", function (resultRow, rawRow, rowIndex) {
                try {
                    //console.log('in csvConverter.on("record_parsed") event, resultRow,',resultRow)
                    //console.log('in csvConverter.on("record_parsed") event, rawRow',rawRow)
                    //if (rowIndex < 2) {
                    //console.log('resultRow', rowIndex, resultRow)
                    //console.log('rawRow', rowIndex, rawRow)
                    for (var key in resultRow) {
                        if (!result[key] || !result[key] instanceof Array) {
                            result[key] = [];
                        }
                        result[key][rowIndex] = resultRow[key];
                        //console.log('in csvConverter.on("record_parsed" for loop, resultRow[key]',resultRow[key])
                        //myMap.set(key,resultRow[key])

                        if (!myMap.get(key)) {
                            myMap.set(key, [])
                        }
                        let thisarray = myMap.get(key);
                        thisarray.push(resultRow[key]);
                        myMap.set(key, thisarray);

                        //console.log('rowIndex, result[key][rowIndex] ',rowIndex,result[key][rowIndex] );
                        //console.log('rowIndex, key, result[key] ',rowIndex,key,result[key])
                        //result[key].pipe(ws)
                    }
                    //}
                }

                catch (err) {
                    console.log(err)
                }
            })
            rs.pipe(csvConverter);//.pipe(ws)
        }
    )
    return p;
}

//If a record already exists for the file, update it
//If a record doesn't exist for the file, insert it
function upsertCsvMetadata(records, year, quarter, cb) {
    //console.log('upsertCsvFile args', records, year, quarter)
    var db = database.getLocalState_CsvMetadata(year, quarter);
    var promises = [];

    for (let i = 0; i < records.length; i++) {
        var p = new Promise(function (resolve, reject) {
            let record = records[i]
            let query = {
                filename: record.filename
            };
            let update = {
                record: record
            };
            let options = {
                upsert: true
            };
            db.update(query, update, options, function (a, b, c) {
                resolve();
            })
        });
        promises.push(p);

        //console.log(promises)
    }
    Promise.all(promises).then(function (value) {
        console.log('finished with upsert. about to call cb()')
        cb();
    })

}


//EXPECT A PERFORMANCE HIT FOR EXTRACTING THE ZIP FILE THE FIRST TIME FUNCTION RUNS
function getPersistedCsvFileMetadata(year, quarter) {

    let p = new Promise(function (resolve, reject) {

        //console.log('inside promise', `${path.basename(__filename)} - getCsvFileMetadata - before getting ref to db`)
        //FIRST, SEARCH FOR PERSISTED METADATA IN DATABASE
        var db = database.getLocalState_CsvMetadata(year, quarter);
        //console.log('inside promise', `${path.basename(__filename)} - getCsvFileMetadata - after getting ref to db`, db)

        db.find({}, function (err, docs) {
            //METADATA FOUND IN DATABASE
            if (docs) {
                //console.log('db.find({}..docs>0', `${path.basename(__filename)} - getCsvFileMetadata - `)
                //console.log('docs.length', docs.length)

                resolve(docs)
            }
            if (err) {
                //console.log('db.find({}err', `${path.basename(__filename)} - getCsvFileMetadata - `)
                throw err;
            }
        });

    })
    return p
}


//nedb table for all variables in this quarter
/**
 *
 * @param year
 * @param quarter
 * @returns {Datastore}
 */
function getLocalState_AllVars(year, quarter) {
    var db = new Datastore({
        filename: path.join(getLocalStateFolder(year, quarter), '/allVars.db'),
        autoload: false,
        timestampData: true
    })
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
function getCsvFolder(year, quarter) {
    var csvFolder = path.resolve(`${config.stage2Location}/${year}_q${quarter}`);
    return csvFolder;
}
function getCsvFolderTest(year, quarter) {
    var csvFolder = path.resolve(`${config.testRoot}/fdic-sdi-quarter/csvFile`);
    return csvFolder;
}

/**
 * Remove all nedb files for this quarter
 * @param year
 * @param quarter
 * @param cb
 */
function resetLocalState(year, quarter, cb) {
    var appDatafolder = path.resolve(`${config.applicationStateLocation}/${year}_q${quarter}`)
    //console.log(appDatafolder)
    FileHandler.deleteFolder(appDatafolder, function (res) {
        cb()
    })
}

function resetCsvFiles(year, quarter, cb) {
    var appDatafolder = getCsvFolder(year, quarter)
    //console.log(appDatafolder)
    FileHandler.deleteFolder(appDatafolder, function (res) {
        cb()
    })
}


module.exports = {
    fdicSdiQuarter_factory,
    getLocalState_AllVars,
    getCsvFolder,
    resetLocalState,
    resetCsvFiles,
    getPersistedCsvFileMetadata,
    extractZipAndPersistMetadata,
    upsertCsvMetadata,
    convertCsvFileToDatabase,
    convertCsvFilesToDatabase
};
