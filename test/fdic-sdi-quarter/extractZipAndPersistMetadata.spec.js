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


var fileThatExists =   path.join(config.stage1Location,"All_Reports_20081231.zip");
var destinationFolder = path.join(config.stage2Location,"2008_q4")


describe('extractZipAndPersistMetadata',function(){
    this.timeout(5000);
    it('should run and return a promise',function(done){
        //console.log('about to invoke extractZipAndPersistMetadata method',`${path.basename(__filename)} - extractZipAndPersistMetadata`)
        //console.log('fileThatExists',fileThatExists)

        var rtrn = FdicSdiQuarterModule.extractZipAndPersistMetadata(fileThatExists,destinationFolder,2009,1)
        //console.log('function rtrn',rtrn)
        expect(rtrn).to.exist
        rtrn.then(function(res,rej){
            //console.log('res',`${path.basename(__filename)} - getCsvFileMetadata - ${res}`,res)
            //console.log('rej', `${path.basename(__filename)} - getCsvFileMetadata - ${rej}`,rej)
            done()
        });
       // console.log('rtrn',`${path.basename(__filename)} - getCsvFileMetadata - rtrn ${rtrn}`,rtrn)
    })
})