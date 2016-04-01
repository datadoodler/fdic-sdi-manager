// Convenience file to require the SDK from the root of the repository
module.exports = require('./lib/fdic-sdi-manager');



'use strict';
var fsm = require('./fdic-sdi-manager.js');
var x=  new fsm('xx');
console.log(fsm);
console.log(x);