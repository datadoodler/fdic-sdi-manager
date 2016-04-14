'use strict';
var fs = require('fs');
var path = require('path');
var unzip = require('unzip');

var yauzl = require("yauzl");


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


function extractZippedFiles(pathToFile, destinationFolder) {
    var p = new Promise(function (resolve, reject) {

        var mycounter = 0;

        yauzl.open(pathToFile, {lazyEntries: true}, function (err, zipfile) {
            if (err) throw err;
            zipfile.readEntry();
            zipfile.on("entry", function (entry) {
                mycounter++;
                // file entry
                zipfile.openReadStream(entry, function (err, readStream) {
                    if (err) throw err;
                    console.log(mycounter)
//                    console.log('entry.fileName',entry.fileName);
//                    console.log('destinationFolder',destinationFolder)
                    readStream.pipe(fs.createWriteStream(destinationFolder + entry.fileName));
                    readStream.on("end", function () {
                        zipfile.readEntry();
                    });
                });
            });
            zipfile.on('end', function (err) {
                resolve(mycounter)
            })
        });


        //var mycounter =0;
        //
        //
        //
        //var readstream = fs.createReadStream(zipFile);
        //readstream.pipe(unzip.Extract({path: destinationFolder}))
        //    .on('write',function(entry){
        //        mycounter++
        //    })
        //.on('finish',function(){
        //    resolve(mycounter)
        //})
        //;


        //var readStream = fs.createReadStream(path.normalize(zipFile));
        //var writeStream = fs.createWriteStream(path.normalize(destinationFolder));
        //
        //readStream
        //    .pipe(unzip.Parse())
        //    .on('entry', (entry) => entry.pipe(writeStream) )
        //    .on('finish', () => {
        //        resolve(10);
        //    })
        //

    });
    return p;
    // console.log(zipFile);
    // console.log(destinationFolder);
    //cb()
    // fs.createReadStream('/Users/kdm/Doodlezone/bankerdoodle/fdic-sdi-manager/test-data/fdic_stage_1/All_Reports_20081231.zip').pipe(unzip.Extract({ path: '/Users/kdm/Doodlezone/bankerdoodle/fdic-sdi-manager/test-data/fdic_stage_2/' }));
    //
    // setTimeout(function(){
    //     console.log('check now')
    // },5000)


    //var readStream = fs.createReadStream(path.normalize(zipFile));
    //var writeStream = fs.createWriteStream(path.normalize(destinationFolder));
    //
    //readStream
    //    .pipe(unzip.Parse())
    //    .pipe(writeStream)

    //readStream
    //    .pipe(unzip.Parse())
    //    .on('entry', (entry) => entry.pipe(writeStream) )
    //    .on('finish', () => {
    //        console.log('finish')
    //    })

    //var readStream = fs.createReadStream(zipFile);
    //var writeStream = fs.createWriteStream(destinationFolder);
    ////console.log(writeStream);
    //readStream
    //    .pipe(unzip.Parse())
    //    .pipe(writeStream)
}


function getCompressedFileNames(zipFile) {
    var p = new Promise(function (resolve, reject) {
        var ret = [];

        var strm = fs.createReadStream(zipFile);
        strm.on('error', function () {
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

function getMyFils() {
    var prm = new Promise(function (resolve, reject) {

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

module.exports = {
    fileExists,
    getCompressedFileNames,
    extractZippedFiles
};
