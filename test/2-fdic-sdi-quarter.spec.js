'use strict';
var path = require('path');
var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;

var config = require('config');
var co = require('co')

var FdicSdiQuarterModule = require('../src/fdic-sdi-quarter');
var QDate = require('../src/q-date.js');
var database = require('../src/database.js');



describe('fdic-sdi-quarter - With Valid QDate - GETTERS AND SETTERS', function () {
    this.timeout(205000);
    var myFdicSdiQuarter;
    before(function (done) {
var startTime = Date.now()
        var options = {year: 2008, quarter: 4};

        var fdicSdiQuarter = co(FdicSdiQuarterModule.fdicSdiQuarter_factory(options));
        //console.log("This is fdic quarter in 2 ", fdicSdiQuarter);
        fdicSdiQuarter.then(function (result) {
            myFdicSdiQuarter = result;
            //console.log(result);
            console.log('milisconds:',Date.now()-startTime)
            done()
        })
    });

    it('instantiates', function () {
        expect(myFdicSdiQuarter).to.exist
        // console.log(myFdicSdiQuarter.fname)
    });

    it('options parameter has correct keys', function () {
        var props = Object.getOwnPropertyNames(myFdicSdiQuarter)
        //console.log(props)
        //console.log(myFdicSdiQuarter.csvFileMetadata)
        //console.log(props.findIndex(x => x === "yyyy"))
        const descriptor = Object.getOwnPropertyDescriptor(myFdicSdiQuarter, '_qDate');
        //console.log(descriptor)
        //expect(myFdicSdiQuarter).to.be.an.instanceof(Object);
        //myFdicSdiQuarter.setSuccessfulAction('test')
        //myFdicSdiQuarter.setSuccessfulAction('test')
        //console.log(myFdicSdiQuarter._successfulActions)
        //console.log(myFdicSdiQuarter.getSuccessfullAction('test'))
    });
})
/*
    describe.skip('basic instance properties', function () {

        it('qDate property of type QDate', function () {
            expect(myFdicSdiQuarter.qDate).to.be.an.instanceof(QDate)
        });

        it('stage1Filename property derived from qDate and stage1Location', function () {
            var fname = path.join(config.stage1Location, '/All_Reports_' + myFdicSdiQuarter.qDate.string + '.zip');
            expect(myFdicSdiQuarter.stage1Filename).to.equal(fname);
        });

        it('zipFileExpanded (bool)', function () {
            expect(typeof myFdicSdiQuarter.zipFileExpanded).to.equal('boolean')
        });

        it('stage1FileExists property (bool)', function () {
            expect(myFdicSdiQuarter.stage1FileExists).to.be.true;
        });

        it('csvFilenames property should be empty array when object first initialized', function () {
            expect(myFdicSdiQuarter.csvFileMetadata).to.be.empty;
            expect(myFdicSdiQuarter.csvFileMetadata).to.be.an('Array');
        });

        it('should have a zipFileExpanded property (bool)', function () {
            expect(typeof myFdicSdiQuarter.zipFileExpanded).to.equal('boolean')
        });

    });


    describe.skip('csvFiles database-related methods', function () {

        it('extractZip - If a file starts u', function () {
            expect(fdicSdiQuarter.extractZip).to.exist;
        });

        it.skip('csvFilenames property exists', function () {
            expect(fdicSdiQuarter.csvFileMetadata).to.be.an('array');
            fdicSdiQuarter.persistCsvFilenames(function (rslt, b) {
                console.log(rslt, b)
            });
        });

        it('should have an insertCsvFiles method', function () {
            expect(fdicSdiQuarter.persistCsvFilenames).to.exist;
        });

        it('should have an upsertCsvFile method', function () {
            expect(fdicSdiQuarter.upsertCsvFile).to.exist;
        });

        it('should gain access to actual filename', function () {
            var qdate = new QDate(2015, 1);
            var qtr = new FdicSdiQuarter(qdate);
            qtr.persistCsvFilenames();
        })
    })
})*/

/*describe('fdic-sdi-quarter - ZIP FILE HAS NOT BEEN EXPANDED', function () {
    this.timeout(5000);
    var myFdicSdiQuarter;
    var options = {year: 2008, quarter: 4};

    //delete all corresponding nedb tables
    before(function (done) {
        FdicSdiQuarterModule.resetLocalState(options.year, options.quarter, function (result) {
            done();
        })
    })
    before(function (done) {
        FdicSdiQuarterModule.resetCsvFiles(options.year, options.quarter, function (result) {
            done();
        })
    })
    describe('If the zip file has not been unzipped it should be unzipped on instatiation', function () {
        it('app data should not exist at this point', function (done) {
            var appStateFolder = database.getLocalStateFolder(options.year, options.quarter);
            fs.stat(appStateFolder, function (err, stats) {
                expect(err && err.errno === -2).to.be.true;
                done();
            });
        });

        it('csv files should not exist at this point', function (done) {
            var csvFolder = FdicSdiQuarterModule.getCsvFolder(options.year, options.quarter);
            //console.log(csvFolder);
            fs.stat(csvFolder, function (err, stats) {
                expect(err && err.errno === -2).to.be.true;
                done();
            });
        });

        describe('now lets start with a fresh instance', function () {

            before(function(done){
                var fdicSdiQuarter = co(FdicSdiQuarterModule.fdicSdiQuarter_factory(options))
                fdicSdiQuarter.then(function(results, r1){
                    myFdicSdiQuarter = results;
                    //console.log(results,r1);
                    done();
                });
            });

            it('should exist', function () {
                expect(myFdicSdiQuarter).to.exist;
            });

            it('csv files should now exist', function (done) {
                var csvFolder = FdicSdiQuarterModule.getCsvFolder(options.year, options.quarter)
                //console.log(csvFolder)
                fs.stat(csvFolder, function (err, stats) {
                    //console.log(stats)
                    expect(err).to.not.exist
                    //expect(err && err.errno === -2).to.be.false;
                    done();
                });
            });
        })
    })
})
*/
/*describe.skip('initial state', function () {


    it('starts with no data in appData', function (done) {
        var appDatafolder = path.resolve(`${config.applicationStateLocation}/${options.year}_q${options.quarter}`)
        fs.stat(appDatafolder, function (err, stats) {
            //Check if error defined and the error code is "not exists"
            //console.log(err)
            //console.log(stats)
            expect(err && err.errno === -2).to.be.true;
            done()
        });
    });

    it('Existing quarter initialization', function (done) {
        //var options = {year: 2015, quarter: 1};

        var fdicSdiQuarter = co(FdicSdiQuarterModule.fdicSdiQuarter_factory(options));
        //console.log("This is fdic quarter in 2 ", fdicSdiQuarter);
    });

    it('instantiates', function () {
        expect(myFdicSdiQuarter).to.exist
        // console.log(myFdicSdiQuarter.fname)
    });
    it('should expand zip file on initialization')
})
*/

