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
        console.log('stage1Filename', this.stage1Filename);
        FileHandler.getCompressedFileNames(this.stage1Filename)
            .then(function (result) {
                console.log('p result', result)
            });
        return this.db_csvFiles;
    }

    insertCsvFiles() {
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

