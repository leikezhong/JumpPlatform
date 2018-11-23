cc.Class({
    init:function () {
        // console.log("---init entityManager---")
        this.i = 0;
        this.len = 0;
        this.index = 0;
        this.nowUseEntity = null;
        this.preEntities = [];
        this.removeEntities = [];
        this.entities = [];
        this.entityId = 0;
    },

    getEntityId:function(){
        return this.entityId++;
    },

    addEntity:function(entity){
        if(entity.addToEntityStatus == 0){
            this.index = this.preEntities.indexOf(entity);
            if(this.index == -1){
                this.preEntities.push(entity);
            }
        }
        entity.addToEntityStatus = 1;
    },

    removeEntity:function(entity){
        entity.addToEntityStatus = -1;
    },

    realRemoveEntity:function(entity){
        this.index = this.removeEntities.indexOf(entity);
        if(this.index == -1){
            this.removeEntities.push(entity);
        }
    },

    step:function(){
        this.realAddEntityStep();
        this.len = this.entities.length;
        for(this.i = 0; this.i < this.len; this.i++){
            if(this.entities[this.i].addToEntityStatus == 1){
                this.entities[this.i].step();
            }
        }
        this.realRemoveEntityStep();
    },

    realAddEntityStep:function(){
        if(this.preEntities.length > 0){
            while(this.preEntities.length > 0){
                this.nowUseEntity = this.preEntities.shift();
                this.index = this.entities.indexOf(this.nowUseEntity);
                if(this.index == -1){
                    this.entities.push(this.nowUseEntity);
                }
            }
            this.entities.sort(this.sortEntityId);
            this.nowUseEntity = null;
        }
    },

    realRemoveEntityStep:function(){
        if(this.removeEntities.length > 0){
            while(this.removeEntities.length > 0){
                this.nowUseEntity = this.removeEntities.shift();
                this.index = this.entities.indexOf(this.nowUseEntity);
                if(this.index != -1){
                    this.entities.splice(this.index, 1);
                }
            }
        }
    },

    sortEntityId : function (a, b) {
        return a.entityId-b.entityId;
    },

    clear:function(){
        this.nowUseEntity = null;
        let i;
        for(i = 0; i < this.preEntities.length; i++){
            this.preEntities[i].clear();
            this.preEntities[i] = null;
        }
        this.preEntities = null;
        for(i = 0; i < this.removeEntities.length; i++){
            this.removeEntities[i].clear();
            this.removeEntities[i] = null;
        }
        this.removeEntities = null;
        for(i = 0; i < this.entities.length; i++){
            this.entities[i].clear();
            this.entities[i] = null;
        }
        this.entities = null;
    }
});
