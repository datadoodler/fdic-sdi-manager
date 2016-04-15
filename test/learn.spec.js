'use strict';
var fs = require('fs');

var chai = require('chai');
var expect = chai.expect;


var FdicSdiQuarter = require('../src/fdic-sdi-quarter')
var FileHandler = require('../src/file-handler')
var QDate = require('../src/q-date');
var qDate = new QDate(2008,4);
var fdicSdiQuarter = new FdicSdiQuarter(qDate)
//fdicSdiQuarter.extractZip();

FileHandler.fileExists('xx', function (result) {
    console.log(result)
})