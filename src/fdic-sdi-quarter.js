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
            autoload: true,
            timestampData:true
        });
        this.db_allVars = new Datastore({
            filename: path.join(config.appDataLocation, '/sdiAllVars_' + this.qDate.string + '.db'),
            autoload: true,
            timestampData:true
        })
    }

    get csvFiles() {
        //console.log('stage1Filename', this.stage1Filename);

        return this.db_csvFiles;
    }

    insertCsvFiles() {
        console.log('in inserCsvFiles FileHandler',FileHandler);
        //console.log(this)
        var p = FileHandler.getCompressedFileNames(this.stage1Filename)
            .then(function (result) {
                for (let i = 0; i < result.length; i++) {
                    let record = {filename: result[i]};
                    console.log(record);
                    this.upsertCsvFile(result[i]);
                    //this.csvFiles.insert(record, function (err,newDoc) {
                    //    console.log(err,newDoc)
                    //});
                }
            }.bind(this));
        //this.db_csvFiles.insert({test: "abc"})
    }

    upsertCsvFile(filename){
        let query = {
            filename:filename
        };
        let update = {
            filename:filename
        };
        let options={
            upsert:true
        };
        let callback=function(err, numAffected, affectedDocuments, upsert){
            console.log('err',err,'numAffected',numAffected,'affectedDocuments',affectedDocuments,'upsert',upsert)
        };

        this.csvFiles.update(query,update,options,callback);

        //this.csvFiles.find(query,function(err,docs){
        //    console.log('found ',docs)
        //})

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

