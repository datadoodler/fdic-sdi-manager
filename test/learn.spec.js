'use strict';
var fs = require('fs');
var path = require('path');
var unzip = require('unzip');
var chai = require('chai');


var FdicSdiQuarter = require('../src/fdic-sdi-quarter')
var QDate = require('../src/q-date');
var qDate = new QDate(2008,4);
var expect = chai.expect;

var fdicSdiQuarter = new FdicSdiQuarter(qDate)

fdicSdiQuarter.extractZip();

//describe.skip('my learning test',function() {
//    it('should test something',function(){
//        expect(1).to.equal(2)
//    })
//})


//fs.createReadStream('/Users/kdm/Doodlezone/bankerdoodle/fdic-sdi-manager/test-data/fdic_stage_1/All_Reports_20081231.zip').pipe(unzip.Extract({ path: '/Users/kdm/Doodlezone/bankerdoodle/fdic-sdi-manager/test-data/fdic_stage_2/' }));

var zipFile = path.resolve('/Users/kdm/Doodlezone/bankerdoodle/fdic-sdi-manager/test-data/fdic_stage_1/All_Reports_20081231.zip');
var destinationFolder=path.resolve('/Users/kdm/Doodlezone/bankerdoodle/fdic-sdi-manager/test-data/fdic_stage_2');

//fs.createReadStream(zipFile).pipe(unzip.Extract({ path: destinationFolder }));



//var readStream = fs.createReadStream(zipFile);
//readStream.pipe(unzip.Parse())
//    .on('entry',function(e){ console.log(e)})

//var writeStream = fs.createWriteStream(destinationFolder);
////
////readStream
////    .pipe(unzip.Parse())
////    .pipe(writeStream)
//
//readStream
//    .pipe(unzip.Parse())
//    .on('entry', (entry) => console.log(entry) )
//    .on('finish', () => {
//        console.log('finish')
//    })