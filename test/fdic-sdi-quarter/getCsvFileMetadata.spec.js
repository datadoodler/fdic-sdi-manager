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


var fileThatExists = path.join(__dirname,"source/All_Reports_20081231.zip");
var destinationFolder = path.join(__dirname,"destination")


describe('getCsvFileMetadata',function(){
    it('should run and return a promise',function(done){
        //console.log('about to envoke asyn getCsvFileMetadata method',`${path.basename(__filename)} `)
        var rtrn = FdicSdiQuarterModule.getPersistedCsvFileMetadata(2008,4)
        expect(rtrn).to.exist
        rtrn.then(function(res,rej){
            console.log('res',`${path.basename(__filename)} - getCsvFileMetadata - ${res}`,res)
            console.log('rej', `${path.basename(__filename)} - getCsvFileMetadata - ${rej}`,rej)
            done()
        });
       // console.log('rtrn',`${path.basename(__filename)} - getCsvFileMetadata - rtrn ${rtrn}`,rtrn)
    })
})