var chai = require('chai');
var expect = chai.expect;

var FdicSdiManager = require('../lib/fdic-sdi-manager.js');
var QDate = require('../lib/q-date.js');

describe('fdic-sdi-manager module', function () {
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
        })
        it('should take a qdate object in the constructor', function () {
            var qdate = new QDate(20, 4);
            var fdicSdiManager = new FdicSdiManager(qdate);

            expect(qdate).to.be.an.instanceof(QDate);
            expect(fdicSdiManager).to.be.an.instanceof(FdicSdiManager);
        });
    });

    describe('fdic-sdi-manager instance properties', function () {
        var qdate = new QDate(20, 4);
        var fdicSdiManager = new FdicSdiManager(qdate);
        it('should have a qDate property of type QDate')
        it('should have a read-only stage1Location property assigned in configuartion', function () {
            var conf=require('config');
            var stage1Location_conf=conf.stage1Location;
            expect(fdicSdiManager.stage1Location).to.be.equal(stage1Location_conf);
        });
    });
});