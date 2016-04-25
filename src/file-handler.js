'use strict';
var fs = require('fs');
var path = require('path');
var config = require('config')
var logger = require('./logger');
var yauzl = require("yauzl");
var rimraf = require('rimraf');

function fileExists(path, cb) {
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

function makeFolder(path) {
    try {
        fs.mkdirSync(path);
    }
    catch (e) {
        logger.silly(e)
    }
}

function extractZippedFiles(pathToFile, destfolder) {
    console.log('destfolder',destfolder)
    makeFolder(destfolder);
    console.log('pathToFile',pathToFile)
    var destinationFolder = path.resolve(destfolder)
    console.log('destfolder',destfolder)
    var p = new Promise(function (resolve, reject) {

        fileExists(pathToFile, function (result) {
                if (!result) {
                    throw `in fileExists() metho - FILE ${pathToFile} DOES NOT EXIST`;
                }
                else {

                    var mycounter = 0;
                    var csvFileMetadata = [];
                    try {
                        yauzl.open(pathToFile, {lazyEntries: true}, function (err, zipfile) {
                            if (err) handleErr();//throw err;
                            zipfile.readEntry();
                            zipfile.on("entry", function (entry) {
                                mycounter++;
                                // file entry
                                zipfile.openReadStream(entry, function (err, readStream) {
                                    if (err) {
                                        logger.error(err);
                                        throw err;
                                    }
                                    //console.log('entry',entry.lastModFileDate)
                                    csvFileMetadata.push({
                                        filename:entry.fileName,
                                        lastModifiedTime:entry.lastModFileTime,
                                        lastModFileDate:entry.lastModFileDate
                                    });
                                    //console.log(csvFileMetadata)
                                    //console.log('entryx', entry);
                                    readStream.pipe(fs.createWriteStream(destinationFolder + '/' + entry.fileName));
                                    readStream.on("end", function () {
                                        zipfile.readEntry();
                                    });
                                });
                            });
                            zipfile.on('end', function (err,r1) {
                                console.log('err,r1',err,r1)
                                console.log('csvFileMetadata.length',csvFileMetadata.length)
                                resolve(csvFileMetadata)
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



module.exports = {
    fileExists,
    getCompressedFileNames,
    extractZippedFiles,
    deleteFolder
};
