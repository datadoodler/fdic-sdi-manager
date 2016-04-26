const fs  = require('fs');
const path = require('path')


module.exports = function (wallaby) {
    return {
        files: [

            'src/file-handler.js',
            'src/**/*.js',
            'config/**/*.json',
            'index.js',
            {pattern: 'src/**/*.spec.js', ignore:true},
            {pattern: '**/*.db', ignore:true},
            {pattern: 'node_modules/**/*.*', ignore:true}
        ],

        tests: [
            'test/2-fdic-sdi-quarter.spec.js',
//            'test/**/*.spec.js',
            {pattern: 'test/4-file-handler.spec.jsx', ignore:true}
        ],
        env: {
            type: 'node'
        },


        testFramework:'mocha',

        workers: {
            recycle: true
        }
    };
};