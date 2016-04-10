'use strict';
var fs = require('fs');
var path = require('path');
var unzip = require('unzip');


function fileExists(path) {
    var p = new Promise(function (resolve, reject) {
        fs.stat(path, function (err, stats) {
            if (err) {
                resolve(false)
            }
            if (stats && stats.isFile) {
                resolve(true)
            }
        })
    });

    return p;
}


function expandCompressedFiles(zipFile,destinationFolder){

//   console.log('zip',zipFile);
//    console.log('dest',destinationFolder);
//    var readStream = fs.createReadStream(zipFile);
//    var writeStream = fs.createWriteStream(destinationFolder);
//console.log(writeStream)
//    readStream
//        .pipe(unzip.Parse())
//        .pipe(writeStream)

    fs.createReadStream(zipFile)
        .pipe(unzip.Extract({ path: destinationFolder }));

}


function getCompressedFileNames(zipFile) {
    var p = new Promise(function (resolve, reject) {
        var ret = [];

        var strm = fs.createReadStream(zipFile);
        strm.on('error',function(){
            resolve(ret)
        });
        strm.pipe(unzip.Parse())
            .on('entry', function (entry) {
                process.stdout.write('x');
                ret.push(entry.path);
                entry.autodrain();
            });
        strm.on('end', function () {
            resolve(ret);
        });
    });
    return p;
}
module.exports = {
    fileExists,
    getCompressedFileNames,
    expandCompressedFiles
};


//var zip = path.resolve('./test-data/fdic_stage_1/All_Reports_20081231.zip');

//expandCompressedFiles(zip,"/Users/kdm/Doodlezone/bankerdoodle/fdic-sdi-manager/test-data/fdic_stage_2");

function getMyFils() {
    var prm = new Promise(function (resolve, reject) {

        console.log('inside getMyFils')
        var ret = [];

        var strm = fs.createReadStream(path);
        strm.pipe(unzip.Parse())
            .on('entry', function (entry) {
                process.stdout.write('x');
                ret.push(entry.path);
                entry.autodrain();
            });
        strm.on('end', function () {
            console.log('\n');
            resolve(ret);
        });
    });
    return prm;
}

