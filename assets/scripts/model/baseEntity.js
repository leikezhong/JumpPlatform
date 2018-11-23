cc.Class({
    extends:cc.Class,

    init:function(){
        this.entityType = -1;
        this.entityId = battle.entityManager.getEntityId();
        this.addToEntityStatus = 0;
        this.isInPool = false;
        this.baseFrame = 0;

        battle.entityManager.addEntity(this);
    },

    step:function(){
        this.baseFrame++;
    },

    clear:function(){
        battle.entityManager.removeEntity(this);
    }
});
