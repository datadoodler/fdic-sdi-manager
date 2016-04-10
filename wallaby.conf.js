module.exports = function () {
    return {
        files: [
            '!lib/**/*.spec.js',
            '!lib/file-handler.js',
            'lib/**/*.js',
            'config/**/*.json',
            'index.js'
        ],

        tests: [
            'test/**/*.spec.js'
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