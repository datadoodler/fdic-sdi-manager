'use strict';

var config = require('config');
//console.log(config);

//console.log(config.get('Customer.credit'))


class FdicSdiManager{


    constructor(ydate){
        this.ydate=ydate;
        this.customerCredit = config.get('Customer.credit')
    }

     //stage1Location:"x";
    get stage1Location(){
        return config.stage1Location
    }
}

module.exports=FdicSdiManager;

