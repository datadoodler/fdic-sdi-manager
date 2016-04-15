'use strict';
var fs = require('fs');

var chai = require('chai');
var expect = chai.expect;


var FdicSdiQuarter = require('../src/fdic-sdi-quarter')
var FileHandler = require('../src/file-handler')
var QDate = require('../src/q-date');
var qDate = new QDate(2008, 4);
var fdicSdiQuarter = new FdicSdiQuarter(qDate);
//fdicSdiQuarter.extractZip();

var co = require('co');

class MyClass {

    constructor() {
        function *myGen() {
            try {
                this._fname = yield getName('kent');
                this._lname = yield getLName('a','merrell');
                console.log(fname, lname)
            }
            catch (e) {
                console.log('ERROR', e)
            }
        }
    }

    get fname (){
        return this._fname;
    }
}

co(myGen);

var myClass = new MyClass();
//console.log("Lady's and gentlemen! I give you fname", myClass.fname);

console.log('XXXX',myGen)
function *myGen() {
    try {
        var fname = yield getName('kent');
        var lname = yield getLName(fname, 'merrell');
        //var two = yield 2;
        //var three = yield 3;
        //var res = yield [fname, lname];
        console.log(fname, lname)
    }
    catch (e) {
        console.log('ERROR', e)
    }
}


function getNameNoPromise(namex) {
    console.log('in getNameNoPromise', namex)
    return {namex};
}
function getName(name) {
    console.log('in getName', name)
    var p = new Promise(function (resolve, rej) {
        setTimeout(function () {
            console.log('leaving getName1', name)
            resolve(name)
            console.log('leaving getName2', name)
        }, 2000)

    });
    return p;
}


function getLName(fname, name) {
    console.log('in getLName', name)
    var p = new Promise(function (resolve, rej) {
        setTimeout(function () {
            console.log('leaving getLName1', name)
            resolve(fname + name)
            console.log('leaving getLName2', name)
        }, 500)
    });
    return p;
}


//var nme = getName('kdm');
//nme.then(function (result) {
//    console.log('inside then', result)
//})
//console.log('nme', nme)