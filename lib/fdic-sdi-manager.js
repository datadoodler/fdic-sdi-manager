'use strict';
class FdicSdiManager{
    constructor(qdate){
        this.qdate=qdate;
    }
}

module.exports=FdicSdiManager;

var fsm = new FdicSdiManager('qdate1');

console.log(fsm);