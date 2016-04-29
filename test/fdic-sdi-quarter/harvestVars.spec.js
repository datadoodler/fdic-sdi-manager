'use strict';
var path = require('path');
var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;

var config = require('config');
var co = require('co')

var FdicSdiQuarterModule = require('../../src/fdic-sdi-quarter');
var QDate = require('../../src/q-date.js');
var database = require('../../src/database.js');


//convertCsvFilesToDatabase(csvFileRecords, year, quarter, cb)

describe.skip('convert a file', function () {
    this.timeout(5000);
    it('should run and return a promise', function (done) {
        var fileThatExists = path.join(config.testRoot, "fdic-sdi-quarter/csvFile/csvFile1.csv")
        FdicSdiQuarterModule.convertCsvFileToDatabase(fileThatExists)
            .then(function (result) {
                console.log("IT CAME BACK!!", result);
                done()
            })
    })
});

describe('convert a csv file to databases', function () {
    this.timeout(15000);
    it('should run and build 2 databases in the same directory', function (done) {
        var csvFileRecords = [{filename: 'csvFile1.csv'}, {filename: 'csvFile2.csv'}];
        FdicSdiQuarterModule.convertCsvFilesToDatabase(csvFileRecords, 2008, 1, function (result) {
            console.log('result', result);
            done()
        })
    })
})