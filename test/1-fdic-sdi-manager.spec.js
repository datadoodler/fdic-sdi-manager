'use strict';
var path = require('path');
var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;

var config = require('config');
var FdicSdiManager = require('../src/fdic-sdi-manager.js');
var FdicSdiQuarter = require('../src/fdic-sdi-quarter.js');
var QDate = require('../src/q-date.js');

describe('1- fdic-sdi-manager module', function () {
    describe('Instantiating index.js in root', function () {
        it('should refer to a FdicSdiManager object', function () {
            var indexJs = require('../index.js');
            var fdicSdiManager = new indexJs('qd');
            expect(fdicSdiManager).to.be.an.instanceof(FdicSdiManager)
        });
        it('should instantiate', function () {
            var fdicSdiManager = new FdicSdiManager('qd');
            expect(fdicSdiManager).to.be.an.instanceof(FdicSdiManager)
        });
        it('should have a addFdicSdiQuarter method which takes an FdicSdiQuarter object parameter',function(){
            var fdicSdiManager = new FdicSdiManager();
            var qdate = new QDate(2012,1);
            var quarterIn = new FdicSdiQuarter(qdate);
            expect(fdicSdiManager.addFdicSdiQuarter).to.be.a('Function');
            fdicSdiManager.addFdicSdiQuarter(quarterIn)
            var quarterOut = fdicSdiManager.getFdicSdiQuarter(qdate);
            expect(quarterIn).to.equal(quarterOut);
        });
        it('should have a getFdicSdiQuarter method which takes a QDate object parameter and returns a FdicSdiQuarter',function(){
            var fdicSdiManager = new FdicSdiManager();
            var qdate = new QDate(2012,1);
            var quarterIn = new FdicSdiQuarter(qdate);
            expect(fdicSdiManager.addFdicSdiQuarter).to.be.a('Function');
            fdicSdiManager.addFdicSdiQuarter(quarterIn);
            fdicSdiManager.addFdicSdiQuarter(quarterIn);
            var quarterOut = fdicSdiManager.getFdicSdiQuarter(qdate);
            expect(quarterOut).to.be.an.instanceof(FdicSdiQuarter);
            expect(quarterIn).to.equal(quarterOut);
        })

    });
});