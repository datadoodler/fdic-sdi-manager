'use strict';
var fs = require('fs');
var path = require('path');
var config = require('config')
var logger = require('./logger');
var yauzl = require("yauzl");
var rimraf = require('rimraf');
var mkdirp = require('mkdirp')


function fileExistsPromise(path) {
    var p = new Promise(function (resolve, reject) {
        fileExists(path, function (result) {
            if (result) {
                resolve(true)
            }
            else
                reject(false)
        })
    })
    return p;
}
function fileExists(path, cb) {
    fs.stat(path, function (err, stats) {
        if (err) {
            cb(false)
        }
        if (stats && stats.isFile()) {
            //console.log(stats.isFile())
            cb(true)
        }
    })

}


function deleteFolder(foldername, cb) {
    rimraf(foldername, function (err) {
        if (!err) {
            cb()
        }
        else {
            throw "Error deleting appData";
        }
    })
}

function makeFolder(path, cb) {
    mkdirp(path, function (err) {
        if (err) {
            throw err
        }
        else cb(true)
    })
}

function extractZippedFiles(pathToFile, destfolder) {
    console.log('destfolder', destfolder)
    var destinationFolder = path.resolve(destfolder)

    var p = new Promise(function (resolve, reject) {
        makeFolder(destinationFolder, function (result) {
            var mycounter = 0;
            var csvFileMetadata = [];
            console.log(pathToFile)
            yauzl.open(pathToFile, {lazyEntries: true}, function (err, zipfile) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                zipfile.readEntry();
                zipfile.on("entry", function (entry) {
                    mycounter++;
                    //console.log(mycounter)
                    // file entry
                    zipfile.openReadStream(entry, function (err, readStream) {
                        if (err) {
                            logger.error(err);
                            throw err;
                        }

                        //console.log('entry', entry.lastModFileDate)
                        csvFileMetadata.push({
                            filename: entry.fileName,
                            lastModifiedTime: entry.lastModFileTime,
                            lastModFileDate: entry.lastModFileDate
                        });
                        //console.log(csvFileMetadata)
                        //console.log('entryx', entry);
                        //console.log(entry.fileName);
                        readStream.pipe(fs.createWriteStream(destinationFolder + '/' + entry.fileName));
                        readStream.on("end", function (x, y) {
                           // console.log(x, y)
                            zipfile.readEntry();
                        });
                    });
                });
                zipfile.on('end', function (err, r1) {
                    console.log('err,r1', err, r1)
                    console.log('csvFileMetadata.length', csvFileMetadata.length)
                    resolve(csvFileMetadata)
                })
            });
        })
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


module.exports = {
    fileExists,
    fileExistsPromise,
    getCompressedFileNames,
    extractZippedFiles,
    deleteFolder
};
