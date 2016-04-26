'use strict';
//import fdicSdiQuarter_factory from '../src/fdic-sdi-quarter'
var fs = require('fs');

var chai = require('chai');
var expect = chai.expect;
var co = require('co');

var FdicSdiQuarter_factory = require('../src/fdic-sdi-quarter');
var FileHandler = require('../src/file-handler');
var QDate = require('../src/q-date');
var qDate = new QDate(2008, 4);
var fdicSdiQuarter;
try {
    fdicSdiQuarter = co(FdicSdiQuarter_factory(null, 2012, 4));

//fdicSdiQuarter.extractZip();
    //console.log('fdicSdiQuarter', fdicSdiQuarter);
//console.log('typeof fdicSdiQuarter',typeof fdicSdiQuarter.then);
//console.log('instance of?',fdicSdiQuarter instanceof Promise)
    fdicSdiQuarter.then(function (fdicSdiQuarter) {
        //console.log('fdicSdiQuarter', fdicSdiQuarter.fname);
    });

}
catch (e) {
    //console.log(`holy cow batman we have an error!`, e)
}

//console.log('fdicSdiQuarter', fdicSdiQuarter);