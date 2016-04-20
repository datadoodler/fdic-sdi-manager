'use strict';
var path = require('path');
var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;

var config = require('config');
var co = require('co')

var FdicSdiQuarter_factory = require('../src/fdic-sdi-quarter');
var QDate = require('../src/q-date.js');


describe.only('fdic-sdi-quarter - With Valid QDate - GETTERS AND SETTERS', function () {
    this.timeout(15000);
    var myFdicSdiQuarter;
    before(function (done) {

        var options = {year: 2015, quarter: 1};

        var fdicSdiQuarter = co(FdicSdiQuarter_factory(options));
        //console.log("This is fdic quarter in 2 ",fdicSdiQuarter);
        fdicSdiQuarter.then(function (result) {
            myFdicSdiQuarter = result;
            //console.log(result);
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
        expect(myFdicSdiQuarter).to.be.an.instanceof(Object);
        myFdicSdiQuarter.setSuccessfulAction('test')
        myFdicSdiQuarter.setSuccessfulAction('test')
        //console.log(myFdicSdiQuarter._successfulActions)
        //console.log(myFdicSdiQuarter.getSuccessfullAction('test'))
    });

    describe('basic instance properties', function () {

        it('qDate property of type QDate', function () {
            expect(myFdicSdiQuarter.qDate).to.be.an.instanceof(QDate)
        });

        it('stage1Location property assigned in configuartion', function () {
            var stage1Location_conf = config.stage1Location;
            expect(stage1Location_conf.length).to.be.above(0);
            expect(myFdicSdiQuarter.stage1Location).to.be.equal(stage1Location_conf);
        });

        it('stage1Filename property derived from qDate and stage1Location', function () {
            var fname = path.join(config.stage1Location, '/All_Reports_' + myFdicSdiQuarter.qDate.string + '.zip');
            expect(myFdicSdiQuarter.stage1Filename).to.equal(fname);
        });

        it('zipFileExpanded (bool)', function () {
            expect(typeof myFdicSdiQuarter.zipFileExpanded).to.equal('boolean')
        });

        it('stage1FileExists property (bool)', function () {
            console.log(myFdicSdiQuarter.stage1FileExists);
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

        it('extractZip method exists', function () {
            expect(fdicSdiQuarter.extractZip).to.exist;
        });

        it('extractZip method actually extracts files', function () {
            fdicSdiQuarter.extractZip();
            //WARNING: This method should be skipped most of the time due to perf hit.
        })

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
})

describe('fdic-sdi-quarter - ZIP FILE HAS NOT BEEN EXPANDED', function () {
    this.timeout(15000);
    var myFdicSdiQuarter;
    var options = {year: 2015, quarter: 1};

    before(function (done) {
        removeAppData(options.year, options.quarter, function (result) {
            done();
        })
    })

    before(function (done) {

        var options = {year: 2015, quarter: 1};

        var fdicSdiQuarter = co(FdicSdiQuarter_factory(options));
        //console.log("This is fdic quarter in 2 ",fdicSdiQuarter);
        fdicSdiQuarter.then(function (result) {
            myFdicSdiQuarter = result;
            //console.log(result);
            done()
        })
    });
    it('instantiates', function () {
        expect(myFdicSdiQuarter).to.exist
        // console.log(myFdicSdiQuarter.fname)
    });
})


function removeAppData(year, quarter, cb) {
    cb()
}