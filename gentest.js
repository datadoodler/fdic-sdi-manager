var p = new Promise(function (rslv, rjct) {
    console.log('running promise executor function..')
    setTimeout(function () {
        rjct("ABC");
    }, 2000)
});


p.then(function (val) {
        console.log("in the 'then' phase")
        console.log('then val:', val)
    })
    .catch(function (reason) {
        console.log('in catch reason: ', reason)
    })

console.log("p at the end", p)