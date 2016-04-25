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


describe('upsertCsvFile', function () {
    this.timeout(5000);
    it('should insert data into local datasore', function (done) {
        var records =[
            {filename: 'f1', year:2008, quarter:2},
            {filename: 'f2', year:2008, quarter:2},
            {filename: 'f3', year:2008, quarter:2}
        ]
        //console.log('about to invoke upsertCsvFile method', `${path.basename(__filename)} - upsertCsvFile`,records);
        FdicSdiQuarterModule.upsertCsvFile(records,2008,2,function(){
            done()
        });

        //database.getLocalState_CsvMetadata(2008, 3,function(){
        //    done()
        //})
        //console.log('rtrn', rtrn);
        //done()
    })
})