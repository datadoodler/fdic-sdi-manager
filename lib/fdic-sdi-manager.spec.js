describe('fdic-sdi-manager',function(){
    it('should exist',function(){
        var FdicSdiManager = require('./fdic-sdi-manager');
        var fsm = new FdicSdiManager('x');
        console.log(fsm)
        var x = true;
        expect(x).toBeDefined();
    })
})