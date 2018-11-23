var baseEntity = require("baseEntity");
cc.Class({
    extends: baseEntity,

    init:function(initPos, wid, hei){
        this._super();
        this.initPos = initPos;
        this.terrainWid = wid;
        this.terrainHei = hei;
        battle.posManager.initCharParams(this);
        battle.physicsManager.initCharParams(this);
        battle.physicsManager.initCharTerrain(this);

        console.log("create star entity");
    },

    //跳跃
    startJump:function(){
        battle.physicsManager.startCharJump(this);
    },

    setCharGravity:function(value){
        battle.physicsManager.setCharGravity(this, value);
    },

    setBodyVel:function(velX, velY){
        battle.physicsManager.setCharBodyVel(this, velX, velY);
    },

    //物理碰撞
    terrainCollision: function(entity, contact, type){
        switch (type) {
            case shareDefine.PHY.TERRAIN_START:
                this.terrainResult = battle.physicsManager.terrainCharStart(this, entity, contact);
                break;
            case shareDefine.PHY.TERRAIN_PRE:
                this.terrainResult = battle.physicsManager.terrainCharPre(this, entity, contact);
                break;
            case shareDefine.PHY.TERRAIN_SEQ:
                this.terrainResult = battle.physicsManager.terrainCharSeq(this, entity, contact);
                break;
        }
        return this.terrainResult;
    },

    step:function(){
        battle.posManager.charPosStep(this);
        battle.physicsManager.terrainCharStep(this);  
    },

    clear:function(){
        this._super();
        battle.physicsManager.destroyTerrain(this);
    }
})