'use strict';
var fs = require('fs');

var chai = require('chai');


var FdicSdiQuarter = require('../src/fdic-sdi-quarter')
var QDate = require('../src/q-date');
var qDate = new QDate(2008,4);
var expect = chai.expect;

var fdicSdiQuarter = new FdicSdiQuarter(qDate)

fdicSdiQuarter.extractZip();

