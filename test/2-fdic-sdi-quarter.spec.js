var path = require('path');
var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;

var config = require('config');
var FdicSdiQuarter = require('../lib/fdic-sdi-quarter.js');
var QDate = require('../lib/q-date.js');

describe('2- fdic-sdi-quarter module', function () {
    it('should take a qdate object in the constructor', function () {
        var qdate = new QDate(20, 4);
        var fdicSdiQuarter = new FdicSdiQuarter(qdate);

        expect(qdate).to.be.an.instanceof(QDate);
        expect(fdicSdiQuarter).to.be.an.instanceof(FdicSdiQuarter);
    });
    describe('fdic-sdi-quarter instance properties', function () {
        var qdate = new QDate(2015, 1);
        var fdicSdiQuarter = new FdicSdiQuarter(qdate);
        it('should have a qDate property of type QDate', function () {
            expect(fdicSdiQuarter.qDate).to.be.an.instanceof(QDate)
        });
        it('should have a stage1Location property assigned in configuartion', function () {
            var stage1Location_conf = config.stage1Location;
            expect(stage1Location_conf.length).to.be.above(0);
            expect(fdicSdiQuarter.stage1Location).to.be.equal(stage1Location_conf);
        });
        it('should have a stage1Filename property derived from qDate and stage1Location', function () {
            var fname = path.join(config.stage1Location, '/All_Reports_' + fdicSdiQuarter.qDate.string + '.zip');
            expect(fdicSdiQuarter.stage1Filename).to.equal(fname);
        })
        it('should have a stage1FileExists property (bool)', function () {
            //console.log(fdicSdiManager.stage1FileExists)
        })
    });
})