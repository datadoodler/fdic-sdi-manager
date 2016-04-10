// Convenience file to require the SDK from the root of the repository
module.exports = require('./lib/fdic-sdi-manager');



//'use strict';
//exports.fsm = require('./lib/fdic-sdi-manager');
//var x=  new fsm('xxy');
//console.log(fsm);
//console.log('test:',x.test);


//exports.fsm = x;


var FdicSdiQuarter=require('./lib/fdic-sdi-quarter');
var QDate = require('./lib/q-date.js');

var qdate = new QDate(2015,1);
var fdicSdiQuarter = new FdicSdiQuarter(qdate);
var f = fdicSdiQuarter.csvFiles;
console.log('f',f);
fdicSdiQuarter.insertCsvFiles();
console.log(fdicSdiQuarter)
