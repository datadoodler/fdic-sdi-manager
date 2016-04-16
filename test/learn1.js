'use strict';
//import fdicSdiQuarter_factory from '../src/fdic-sdi-quarter'
var fs = require('fs');

var chai = require('chai');
var expect = chai.expect;
var co = require('co');

var fdicSdiQuarter_factory = require('../src/fdic-sdi-quarter');
console.log('FdicSdiQuarter_factory',fdicSdiQuarter_factory)
var FileHandler = require('../src/file-handler');
var QDate = require('../src/q-date');
var qDate = new QDate(2008, 4);
var fdicSdiQuarter = co(fdicSdiQuarter_factory(qDate));
//fdicSdiQuarter.extractZip();

fdicSdiQuarter.then(function (result) {
    console.log('fdicSdiQuarter', result);
});
