'use strict';
var fs = require('fs');
var path = require('path');
var config = require('config')

var yauzl = require("yauzl");


function fileExists(path, cb) {
    console.log(path)
    var p = new Promise(function (resolve, reject) {
        fs.stat(path, function (err, stats) {
            if (err) {
                if (cb) {
                    cb(false)
                }
                resolve(false)
            }
            if (stats && stats.isFile()) {
                //console.log(stats.isFile())
                if (cb) {
                    cb(true)
                }
                resolve(true)
            }
        })
    });

    return p;
}


function extractZippedFiles(pathToFile, destinationFolder) {
    console.log(pathToFile)
    console.log(destinationFolder)
    var destinationFolder=path.resolve(destinationFolder)
    var p = new Promise(function (resolve, reject) {
        function handleErr() {
            resolve([])
        }

        fileExists(pathToFile, function (rsl) {
                if (!rsl) {
                    resolve([])
                }
                else {

                    var mycounter = 0;
                    var ret = [];
                    try {
                        yauzl.open(pathToFile, {lazyEntries: true}, function (err, zipfile) {
                            if (err) handleErr();//throw err;
                            zipfile.readEntry();
                            zipfile.on("entry", function (entry) {
                                mycounter++;
                                // file entry
                                zipfile.openReadStream(entry, function (err, readStream) {
                                    if (err) handleErr();//throw err;
                                    ret.push(entry.fileName);
                                    //console.log(mycounter)
                                    //console.log('entryx', entry);
                                    readStream.pipe(fs.createWriteStream(destinationFolder + entry.fileName));
                                    readStream.on("end", function () {
                                        zipfile.readEntry();
                                    });
                                });
                            });
                            zipfile.on('end', function (err) {
                                resolve(ret)
                            })
                        });
                    }
                    catch (e) {
                        resolve([])
                    }
                }
            }
        );
    })
    return p;

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
