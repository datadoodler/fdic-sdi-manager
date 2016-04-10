'use strict';
var path = require('path');
var fs = require('fs');
var config = require('config');
var Datastore = require('nedb')
var FileHandler = require('./file-handler.js');

class FdicSdiQuarter {


    constructor(qdate) {
        this.qDate = qdate;
        this.db_csvFiles = new Datastore({
            filename: path.join(config.appDataLocation, '/sdiCsvFiles_' + this.qDate.string + '.db'),
            autoload: true
        });
        this.db_allVars = new Datastore({
            filename: path.join(config.appDataLocation, '/sdiAllVars_' + this.qDate.string + '.db'),
            autoload: true
        })
    }

    get csvFiles() {
        //console.log('stage1Filename', this.stage1Filename);

        return this.db_csvFiles;
    }

    insertCsvFiles() {
        var p = FileHandler.getCompressedFileNames(this.stage1Filename)
            //console.log('p',p)
            //    .then(function (result) {
            //        for(let i=0; i<result.length; i++){
            //            //let record = {filename:result[i]};
            //            console.log(this)
            //            //this.db_csvFiles.insert(record,function(result){
            //            //    console.log(result)
            //            //});
            //        }
            //    });

            .then(function (result) {
                for (let i = 0; i < result.length; i++) {
                    let record = {filename: result[i]};
                    //console.log(this)
                    this.db_csvFiles.insert(record, function (result) {
                            console.log(result)
                    });
                }
            }.bind(this));
        this.db_csvFiles.insert({test: "abc"})
    }

    get stage1Location() {
        return config.stage1Location
    }

    get stage1Filename() {
        return path.join(this.stage1Location, '/All_Reports_' + this.qDate.string + '.zip')
    }

    get stage1FileExists() {
        try {
            fs.statSync(this.stage1Filename);
            return true;
        }
        catch (err) {
            return false
        }
        return false;
    }
}

module.exports = FdicSdiQuarter;

