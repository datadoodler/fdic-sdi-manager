'use strict';
var path = require('path');
var config = require('config');
var chai = require('chai');
var expect = chai.expect;
var FileHandler = require('../src/file-handler.js');

var fileThatExists = path.resolve(config.stage1Location + '/All_Reports_20081231.zip');



describe('fileExists method with callback', function () {

    it('callback should return false when file does not exist', function () {
        FileHandler.fileExists('xx', function (result) {
            expect(result).to.be.false;
        })
    })
});



describe('4 -FileHandler', function () {

    it('should be a static grouping of utility methods', function () {
        expect(FileHandler).to.exist;
    });
})



describe('fileExists method with promise', function () {

    it('should be a function type', function () {
        expect(FileHandler.fileExists).to.exist;
    });


    it('should take the absolute path of a file to test', function () {
        FileHandler.fileExists().then(function (result) {
            expect(result).to.equal(false)
        });
    });


    it('should return false if file does not exist', function () {
        FileHandler.fileExists("xx").then(function (result) {
            expect(result).to.equal(false)
        });
    });


    it('should return true if file exists', function () {
        return FileHandler.fileExists(fileThatExists).then(function (result) {
            expect(result).to.equal(true);
        })
    });
});



describe('extractZippedFiles method return array of filename', function () {

    it('should be a function type', function () {
        expect(FileHandler.extractZippedFiles).to.be.a('function')
    });


    it('should return an empty array if the filename does not resolve to a zip file', function () {
        this.timeout(15000);
        return FileHandler.extractZippedFiles("XX").then(function (result) {
            console.log('result', result, result.length)
            expect(result.length).to.equal(0)
        })
    });
});



describe('extractZippedFiles method', function () {


    it('should be a function type', function () {
        expect(FileHandler.extractZippedFiles).to.exist;
    });


    it('should copy all files in zip file to destination folder', function () {
        this.timeout(20000);
        return FileHandler.extractZippedFiles(fileThatExists, config.stage2Location).then(function (result) {
            expect(result.length).to.equal(62);
        });
    });

    it('should overwrite any preexisting files in destination folder');

})
