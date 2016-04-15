'use strict';
require('babel-register');

// Convenience file to require the SDK from the root of the repositor
// y
module.exports = require('./src/fdic-sdi-manager');



//'use strict';
//exports.fsm = require('./src/fdic-sdi-manager');
//var x=  new fsm('xxy');
//console.log(fsm);
//console.log('test:',x.test);


//exports.fsm = x;


//var FdicSdiQuarter=require('./src/fdic-sdi-quarter');
//var QDate = require('./src/q-date.js');

//var qdate = new QDate(2015,1);
//var fdicSdiQuarter = new FdicSdiQuarter(qdate);
//var f = fdicSdiQuarter.csvFiles;
//console.log('f',f);
//console.log(qdate)
//fdicSdiQuarter.insertCsvFiles();
//fdicSdiQuarter.upsertCsvFile("All_Reports_20150331_U.S. Government Obligations.csv");