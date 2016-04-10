'use strict';
var path = require('path');
var fs = require('fs');
var config = require('config');


class FdicSdiQuarter {


    constructor(qdate) {
        //this.qdate=qdate;
        this.qDate = qdate;
        this.customerCredit = config.get('Customer.credit')
    }

    get stage1Location() {
        return config.stage1Location
    }

    get stage1Filename() {
        return path.join(this.stage1Location, '/All_Reports_' + this.qDate.string + '.zip')
    }

    get stage1FileExists() {
        console.log(this.stage1Filename)
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

