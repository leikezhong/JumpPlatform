cc.Class({
    init:function () {
        // console.log("---init resourceManager---");
    },

    loadBaseResource:function(callback){
        let path = ["prefabs"];
        this.loadAllRes(path, callback);
    },

    loadAllRes:function(path, callback){
        if(path.length > 1){
            var self = this;
            var nowPath = path.shift();
            cc.loader.loadResDir(nowPath, function(err, prefabs){
                self.loadAllRes(path, callback);
            });
        }else{
            cc.loader.loadResDir(path[0], function(err, prefabs){
                callback();
            });
        }
    },
    clear:function(){
        cc.loader.releaseResDir("prefabs");
    }
});
