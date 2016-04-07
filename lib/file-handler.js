var fs = require('fs');
var path = require('path')
var unzip = require('unzip');
function fileExists(){
    return false;
}

module.exports={
    fileExists
}

function *idMaker(){
    var index = 0;
    while(index < 3)
        yield index++;
}

//var gen = idMaker();
//for(var i = 0; i < 5; i++)
//{
//    console.log(gen.next());
//}
var p = path.resolve('./test-data/fdic_stage_1/All_Reports_20081231.zip')
var myfiles=[]
function getMyFils(cb) {
    cb("Yehaaa!");
    cb('XXXXXXXXXXXXXXXX')
    console.log('inside getMyFils')
    var ret = []
    fs.createReadStream(p)
        .pipe(unzip.Parse())
        .on('entry', function (entry) {
            console.log(entry.path)
            var fileName = entry.path;
            var type = entry.type; // 'Directory' or 'File'
            var size = entry.size;
            if (fileName === "this IS the file I'm looking for") {
                entry.pipe(fs.createWriteStream('output/path'));
            } else {
                ret.push(entry.path);
                console.log('ret.length:', ret.length)
                cb(ret);
                entry.autodrain();
            }
        })

    ;
}
getMyFils(function(ret){
    console.log('I have returned from getMyFils and I bring this: ', ret)
})
console.log('myfiles',myfiles);