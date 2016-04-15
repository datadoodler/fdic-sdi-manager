'use strict';
var path = require('path');
var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;

var config = require('config');
var FdicSdiQuarter = require('../src/fdic-sdi-quarter.js');
var QDate = require('../src/q-date.js');


describe('From index.html',function(){
    it('inserts files into database',function(){
        var fm = require('../index.js')
    })
})

describe('2- fdic-sdi-quarter module', function () {
    var qdate = new QDate(2015, 1);
    var fdicSdiQuarter = new FdicSdiQuarter(qdate);

    it('should take a qdate object in the constructor', function () {

        expect(qdate).to.be.an.instanceof(QDate);

        expect(fdicSdiQuarter).to.be.an.instanceof(FdicSdiQuarter);
    });

    describe('basic instance properties', function () {

        it('qDate property of type QDate', function () {
            expect(fdicSdiQuarter.qDate).to.be.an.instanceof(QDate)
        });

        it('stage1Location property assigned in configuartion', function () {
            var stage1Location_conf = config.stage1Location;
            expect(stage1Location_conf.length).to.be.above(0);
            expect(fdicSdiQuarter.stage1Location).to.be.equal(stage1Location_conf);
        });

        it('stage1Filename property derived from qDate and stage1Location', function () {
            var fname = path.join(config.stage1Location, '/All_Reports_' + fdicSdiQuarter.qDate.string + '.zip');
            expect(fdicSdiQuarter.stage1Filename).to.equal(fname);
        });

        it('zipFileExpanded (bool)',function(){
            expect(typeof fdicSdiQuarter.zipFileExpanded).to.equal('boolean')
        });

        it('stage1FileExists property (bool)', function () {
            expect(fdicSdiQuarter.stage1FileExists).to.be.true;
            var qdateNotExist = new QDate(2015, 2);
            var fdicSdiQuarterNotExist = new FdicSdiQuarter(qdateNotExist);
            expect(fdicSdiQuarterNotExist.stage1FileExists).to.be.false;
        });

        it('csvFilenames property should be empty array when object first initialized',function(){
            const newFdicQuarter = new FdicSdiQuarter(2012,1);
            expect(newFdicQuarter.csvFilenames).to.be.empty;
            expect(newFdicQuarter.csvFilenames).to.be.an('Array');
        });
        it('should have a unzipped property (bool)',function(){
            expect(typeof fdicSdiQuarter.unzipped).to.equal('boolean')
        });

    });

    describe('csvFiles database-related methods',function(){

        it('extractZip method exists',function(){
            expect(fdicSdiQuarter.extractZip).to.exist;
        });

        it('extractZip method actually extracts files',function(){
            fdicSdiQuarter.extractZip();
            //WARNING: This method should be skipped most of the time due to perf hit.
        })

        it('csvFilenames property exists',function(){
            expect(fdicSdiQuarter.csvFilenames).to.be.an('array');
            fdicSdiQuarter.persistCsvFilenames(function(rslt, b){
                console.log(rslt,b)});
        });

        it('should have an insertCsvFiles method',function(){
            expect(fdicSdiQuarter.persistCsvFilenames).to.exist;
        });

        it('should have an upsertCsvFile method',function(){
            expect(fdicSdiQuarter.upsertCsvFile).to.exist;
        });

        it('should gain access to actual filename',function(){
            var qdate = new QDate(2015, 1);
            var qtr = new FdicSdiQuarter(qdate);
            qtr.persistCsvFilenames();
        })
    })
})