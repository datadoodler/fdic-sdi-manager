var chai = require('chai');
var expect = chai.expect;
var FileHandler = require('../lib/file-handler.js');

//console.log("FH",FileHandler)

describe('FileHandler', function () {
    it('should be a static grouping of utility methods',function(){
        expect(FileHandler).to.exist;
    });
    describe('fileExists method', function () {
        it('should be a function type',function(){
            expect(FileHandler.fileExists).to.exist;
            expect(FileHandler.fileExists()).to.be.false;
        });
        it('should take the absolute path of a file to test');
        it('should return false if file does not exist');
        it('should return true if file exists');
    });
    describe('getCompressedFileCount method', function () {
        it('should be a function type');
        it('should take the absolute path to a zip file');
        it('should return 0 if the passed filename does not resolve to a zip file');
        it('should return the number of files included in a zip file', function () {
            //this does NOT recurse compressed folders. It is meant to work specifically with fdic zip files
        })
    });
    describe('getCompressedFileNames method', function () {
        it('should be a function type');
        it('should take the absolute path to a zip file');
        it('should return an array of file names (strings) included in zip file');
        it('should return an empty array if the filename does not resolve to a zip file');
    });
    describe('expandCompressedFiles method', function () {
        it('should be a function type');
        it('should take the absolute path to a zip file');
        it('should take the absolute path to a destination folder');
        it('should copy all files in zip file to destination folder');
        it('should overwrite any preexisting files in destination folder');
    })
})
