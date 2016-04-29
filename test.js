'use strict';
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#With_a_generator

var cnt = 0
function* generator(array) {
    var nextIndex = 0;

    while(nextIndex < array.length){
        yield anotherAsync(array[nextIndex++]);
    }
}

function anotherAsync(entry) {
    setTimeout(function () {
        console.log('anotherAsync says', entry)
    }, 2000)
    return('from anotherAsync:',5)
}

function master() {
    var myMap = new Map();
    var records = []
    for (let i = 0; i < 5; i++) {
        //myMap.set(i,objectMaker());
        records.push(objectMaker())
    }
    var gen = generator(records);

    while(gen.next().done===false){
        console.log(gen.next().value)
    }
}

master()


function objectMaker() {
    return {id: cnt++}
}

function promiseMaker() {
    cnt++
    var p = new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log(Date.now())
            resolve()
        }, 1000 * cnt)
    })
    return p;
}
