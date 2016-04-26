'use strict';
var path = require('path');
var config = require('config');
var chai = require('chai');
var expect = chai.expect;
var FileHandler = require('../../src/file-handler.js');

var fileThatExists = path.join(__dirname,"source/All_Reports_20081231.zip");
var destinationFolder = path.join(__dirname,"destination")

//console.log('fileThatExists',fileThatExists);
//console.log('destinationFolder',destinationFolder);
describe('test file extraction',function(){
    before('delete any existing files in destination',function(done){
        //console.log('before')
        FileHandler.deleteFolder(destinationFolder,function(){
            done()
        })
    })

    it('should be a function type', function () {
        expect(FileHandler.extractZippedFiles).to.be.a('function')
    });

    it('should copy all files in zip file to destination folder', function (done) {
        this.timeout(20000);
        FileHandler.extractZippedFiles(fileThatExists, destinationFolder).then(function (result) {
            //console.log('result',result);
            expect(result.length).to.equal(62);
            done()
        });
    });

    it('now run getCsvFileMetadata and look for error messages',function(){
        //getCsvFileMetadata
    })
})