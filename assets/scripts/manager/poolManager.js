cc.Class({
    init:function () {
        // console.log("---init poolManager---");
        this.pools = {};
    },

    getFromPool:function(type){
        if(!this.pools[type]){
            return null;
        }else{
            if(this.pools[type].length > 0){
                // console.log("getFromPool:" + type);
                return this.pools[type].shift();
            }
        }
    },

    putInPool:function(entity){
        if(!this.pools[entity.entityType]){
            this.pools[entity.entityType] = [];
        }

        this.pools[entity.entityType].push(entity);
        entity.putInPool();
        
        // console.log("putInPool:" + entity.entityType);
    },


    clear:function(){
        this.pools = {};
    }
});
