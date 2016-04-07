var path = require('path');
var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;

var config = require('config');
var FdicSdiManager = require('../lib/fdic-sdi-manager.js');
var QDate = require('../lib/q-date.js');

describe('1- fdic-sdi-manager module', function () {
    describe('Instantiating index.js in root', function () {
        it('should refer to a FdicSdiManager object', function () {
            var indexJs = require('../index.js');
            var FdicSdiManager = require('../lib/fdic-sdi-manager.js');
            var fdicSdiManager = new indexJs('qd');
            expect(fdicSdiManager).to.be.an.instanceof(FdicSdiManager)
        });
        it('should instantiate', function () {
            var FdicSdiManager = require('../lib/fdic-sdi-manager.js');
            var fdicSdiManager = new FdicSdiManager('qd');
            expect(fdicSdiManager).to.be.an.instanceof(FdicSdiManager)
        });
        it('should take a qdate object in the constructor', function () {
            var qdate = new QDate(20, 4);
            var fdicSdiManager = new FdicSdiManager(qdate);

            expect(qdate).to.be.an.instanceof(QDate);
            expect(fdicSdiManager).to.be.an.instanceof(FdicSdiManager);
        });
    });

    describe('fdic-sdi-manager instance properties', function () {
        var qdate = new QDate(2015, 1);
        var fdicSdiManager = new FdicSdiManager(qdate);
        it('should have a qDate property of type QDate', function () {
            expect(fdicSdiManager.qDate).to.be.an.instanceof(QDate)
        });
        it('should have a stage1Location property assigned in configuartion', function () {
            var stage1Location_conf = config.stage1Location;
            expect(stage1Location_conf.length).to.be.above(0);
            expect(fdicSdiManager.stage1Location).to.be.equal(stage1Location_conf);
        });
        it('should have a stage1Filename property derived from qDate and stage1Location', function () {
            var fname=path.join(config.stage1Location, '/All_Reports_' + fdicSdiManager.qDate.string + '.zip')
           expect(fdicSdiManager.stage1Filename).to.equal(fname);
        })
        it('should have a stage1FileExists property (bool)', function () {
            //console.log(fdicSdiManager.stage1FileExists)
        })
    });
});