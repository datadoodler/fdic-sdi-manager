'use strict';
var path = require('path');

var config = require('config');

var chai = require('chai');
var expect = chai.expect;
var FileHandler = require('../src/file-handler.js');

var fileThatExists = path.resolve('./test-data/fdic_stage_1/All_Reports_20081231.zip');


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

    describe('getCompressedFileNames method', function () {
        this.timeout(15000);
        it('should be a function type', function () {
            expect(FileHandler.getCompressedFileNames).to.exist;

        });
        it.skip('should return an array of file names (strings) included in zip file', function () {
            return FileHandler.getCompressedFileNames(fileThatExists).then(function (result) {
                expect(result.length).to.equal(62)
            })
        });
        it('should return an empty array if the filename does not resolve to a zip file', function () {
            return FileHandler.getCompressedFileNames("XX").then(function (result) {
                console.log(result);
                expect(result.length).to.equal(0)
            })
        });
    });

    describe('expandCompressedFiles method', function () {
        it('should be a function type', function () {
            expect(FileHandler.expandCompressedFiles).to.exist;
        });
        it.skip('should copy all files in zip file to destination folder', function () {
            FileHandler.expandCompressedFiles(fileThatExists, config.stage2Location)
        });
        it('should overwrite any preexisting files in destination folder');
    })
})
