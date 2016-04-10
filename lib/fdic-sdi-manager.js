'use strict';
var path = require('path');
var fs = require('fs');
var config = require('config');

class FdicSdiManager {


    constructor() {
        this._fdicSdiQuarters = new WeakMap();
        this._loadedQuarters=[];
    }


    addFdicSdiQuarter(fdicsdiquarter) {
        if(!fdicsdiquarter.qDate.isValid){
            throw("Invalid fdicSdiQuarter object" + fdicsdiquarter);
        }
        this._fdicSdiQuarters.set(fdicsdiquarter.qDate, fdicsdiquarter)
    }


    getFdicSdiQuarter(qDate) {
        return this._fdicSdiQuarters.get(qDate);
    }



}

module.exports = FdicSdiManager;

