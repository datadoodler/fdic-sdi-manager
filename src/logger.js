//var logger = require('winston');
//var Loggly = require('winston-loggly').Loggly;
//var loggly_options={ subdomain: "doodlezone", inputToken: "b80da0b2-0dd4-42d3-9031-5ff8b56946fe" }
//logger.add(Loggly, loggly_options);
//logger.add(winston.transports.File, { filename: "../logs/production.log" });
//logger.info('Chill Winston, the logs are being captured 3 ways- console, file, and Loggly');
//module.exports=logger;

//var winston = require('winston');
//require('winston-loggly');
//
//winston.add(winston.transports.File,{ filename: "myLog.log"});
//
//winston.add(winston.transports.Loggly, {
//    token: "b80da0b2-0dd4-42d3-9031-5ff8b56946fe",
//    subdomain: "doodlezone",
//    tags: ["Winston-NodeJS"],
//    json:true
//});
//
//winston.log('info',"Hello World from Node.js!xxxxxt");
//
//module.exports = winston;

var winston = require('winston');
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    timestamp: true,
    level: 'verbose',
    colorize: true
});
module.exports = winston;