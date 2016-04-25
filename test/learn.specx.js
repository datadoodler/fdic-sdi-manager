'use strict';
var fs = require('fs');

var chai = require('chai');
var expect = chai.expect;


var FdicSdiQuarter = require('../src/fdic-sdi-quarter');
var FileHandler = require('../src/file-handler');
var QDate = require('../src/q-date');
var qDate = new QDate(2008, 4);
var fdicSdiQuarter = new FdicSdiQuarter(qDate);
//fdicSdiQuarter.extractZip();

var co = require('co');

class MyClass {

    constructor(fname) {
        this._fname = 'temp'
        //co(this.initMe)
    }

    get fname() {
        return this._fname;
    }

    set fname(fname) {
        this._fname = fname
    }
}

function *MyClassFactory(fname) {
    try {

        var myClass = new MyClass(fname);
        myClass.fname = yield getName('kent');
        console.log('in factory, myClass', myClass);
        return myClass;
    }
    catch (e) {
        console.log('WHOA - ERROR!!!', e)
    }
}

var myClass = co(MyClassFactory('johny'));
console.log("just after instantiating co", myClass);
myClass.then(function (result, x) {
    ///console.log('in myClass.then', myClass, result)
    //console.log(result.fname, x);
})


console.log(`so I'm walking along with my new class ${myClass.fname}`);

//co(initMyClass(myClass));

//var myClass = new MyClass();
//console.log("Lady's and gentlemen! I give you fname", myClass.fname);


function *initMyClass(myClass) {
    try {
        myClass.fname = yield getName('kent');
        var lname = yield getLName(myClass.fname, 'merrell');
        //var two = yield 2;
        //var three = yield 3;
        //var res = yield [fname, lname];
        console.log(myClass, lname)
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
    var x = [1,2];
    console.log('wheres the error?',x[3].name)
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