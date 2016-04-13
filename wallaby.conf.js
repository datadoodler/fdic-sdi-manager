const fs  = require('fs');
const path = require('path')

const babelConfiguration= JSON.parse(fs.readFileSync(path.join(__dirname,'.babelrc')));
babelConfiguration.babel = require('babel-core');


module.exports = function (wallaby) {
    return {
        files: [

            'src/file-handler.js',
            'src/**/*.js',
            'config/**/*.json',
            'index.js',
            {pattern: '**/*.spec.js', ignore:true},
            {pattern: 'node_modules/**/*.*', ignore:true}
        ],

        tests: [
            'test/**/*.spec.js'
        ],
        env: {
            type: 'node'
        },

        compilers:{
            '**/*.js' : wallaby.compilers.babel(babelConfiguration)
        },

        testFramework:'mocha',

        workers: {
            recycle: true
        }
    };
};