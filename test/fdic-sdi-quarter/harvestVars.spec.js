'use strict';
var path = require('path');
var fs = require('fs');
var chai = require('chai');
var expect = chai.expect;

var config = require('config');
var co = require('co')

var FdicSdiQuarterModule = require('../../src/fdic-sdi-quarter');
var QDate = require('../../src/q-date.js');
var database = require('../../src/database.js');

function convertCsvToDatabase(csvFile,  cb) {
    var Converter = require("csvtojson").Converter;
    var dbColumnArray=get
    var rs = fs.createReadStream(csvFile);
    var ws = fs.createWriteStream(jsArrayFile);
    var result = {}
    var myMap = new Map();
    var csvConverter = new Converter();

    csvConverter.on("end_parsed", function (jsonObj) {
        console.log('xxxxxxxxx-jsonObj',jsonObj);
        console.log("Finished parsing");
        myMap.forEach(function(val,key){
// write to ...ColumnArray.db

// write to ...OriginalShape.db
            console.log('foreach...',key,val)
        })
        cb();
    });

//record_parsed will be emitted each time a row has been parsed.
    csvConverter.on("record_parsed", function (resultRow, rawRow, rowIndex) {

        if (rowIndex < 2) {
            //console.log('resultRow', rowIndex, resultRow)
            //console.log('rawRow', rowIndex, rawRow)
            for (var key in resultRow) {
                if (!result[key] || !result[key] instanceof Array) {
                    result[key] = [];
                }
                result[key][rowIndex] = resultRow[key];
                //myMap.set(key,resultRow[key])

                if(!myMap.get(key)){
                    myMap.set(key,[])
                }
                let thisarray=myMap.get(key);
                thisarray.push(resultRow[key]);
                myMap.set(key,thisarray);

                //console.log('rowIndex, result[key][rowIndex] ',rowIndex,result[key][rowIndex] );
                //console.log('rowIndex, key, result[key] ',rowIndex,key,result[key])
                //result[key].pipe(ws)
            }
        }
    });

    rs.pipe(csvConverter);//.pipe(ws)
}


describe('harvestVars', function () {
    this.timeout(55000);
    it('should run and return a promise', function (done) {
        var fileThatExists = path.join(config.stage2Location, "2008_q4", "All_Reports_20081231_1-4 Family Residential Net Loans and Leases.csv")
        var jsArrayFile = path.join(config.stage2Location, "2008_q4", "All_Reports_20081231_1-4 Family Residential Net Loans and Leases.js")
        console.log(convertCsvToColumnArray(fileThatExists, jsArrayFile, function () {
            done()
        }))

        // console.log('rtrn',`${path.basename(__filename)} - getCsvFileMetadata - rtrn ${rtrn}`,rtrn)
    })
})