module.exports = function () {
    return {
        files: [
            '!lib/**/*.spec.js',
            'lib/**/*.js'
        ],

        tests: [
            'lib/**/*.spec.js'
        ],
        env: {
            type: 'node'
        },

        testFramework:'jasmine',

        workers: {
            recycle: true
        }
    };
};