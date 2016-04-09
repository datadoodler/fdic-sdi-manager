var fs = require('fs');
var path = require('path')
const zlib = require('zlib');

var unzip = require('unzip');

function fileExists() {
    return false;
}

module.exports = {
    fileExists
}

function * idMaker() {
    var index = 0;
    while (index < 3)
        yield index++;
}

//var gen = idMaker();
//for(var i = 0; i < 5; i++)
//{
//    console.log(gen.next());
//}
var p = path.resolve('./test-data/fdic_stage_1/All_Reports_20081231.zip')
var myfiles = []
function getMyFils() {
    var prm = new Promise(function (resolve, reject) {


        console.log('inside getMyFils')
        var ret = [];

        var strm = fs.createReadStream(p);
        strm.pipe(unzip.Parse())
            .on('entry', function (entry) {
                process.stdout.write('x');
                ret.push(entry.path);
                entry.autodrain();
            });
        strm.on('end', function () {
            console.log('\n');
            resolve(ret);
        });
    });
    return prm;
}

var g = getMyFils();

g.then(function (dta) {
    console.log('g then dta', dta)
});
