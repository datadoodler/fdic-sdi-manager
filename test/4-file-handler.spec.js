'use strict';
var path = require('path');

var config = require('config');

var chai = require('chai');
var expect = chai.expect;
var FileHandler = require('../src/file-handler.js');

var fileThatExists = path.resolve(config.stage1Location + '/All_Reports_20081231.zip');

describe('4 -FileHandler', function () {
    it('should be a static grouping of utility methods', function () {
        expect(FileHandler).to.exist;
    });

    describe('fileExists method', function () {
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

    describe.skip('getCompressedFileNames method', function () {
        this.timeout(15000);
        it('should be a function type', function () {
        });
        it('should return an empty array if the filename does not resolve to a zip file', function () {
            return FileHandler.getCompressedFileNames("XX").then(function (result) {
                expect(result.length).to.equal(0)
            })
        });
    });

    describe.only('extractZippedFiles method', function () {
        it('should be a function type', function () {
            expect(FileHandler.extractZippedFiles).to.exist;
        });

        it('should copy all files in zip file to destination folder', function () {
            this.timeout(20000);


            return FileHandler.extractZippedFiles(fileThatExists, config.stage2Location).then(function(result){
                expect(result).to.equal(62);
            });

        });
        it('should overwrite any preexisting files in destination folder');
    })
})
