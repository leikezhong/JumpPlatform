var baseEntity = require("baseEntity");
cc.Class({
    extends: baseEntity,

    init:function(initPos, wid, hei){
        this._super();
        this.initPos = initPos;
        this.terrainWid = wid;
        this.terrainHei = hei;
        this.nowMaxPosY = 0;
        battle.posManager.initCharParams(this);
        battle.physicsManager.initEntityParams(this);
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
        battle.physicsManager.setEntityBodyVel(this, velX, velY);
    },

    //单独设置x轴位置
    setCharXPos:function(xPos){
        this.nowEntityPos.x = xPos;
        this.nowCenterEntityPos.x = xPos;
        battle.physicsManager.setEntityTerrainPos(this, this.nowCenterEntityPos.x, this.nowCenterEntityPos.y);
    },

    //单独设置y轴位置
    setCharYPos:function(yPos){
        this.nowEntityPos.y = yPos;
        this.nowCenterEntityPos.y = yPos + this.offsetCenterY;
        battle.physicsManager.setEntityTerrainPos(this, this.nowCenterEntityPos.x, this.nowCenterEntityPos.y);
    },

    //物理碰撞
    terrainCollision: function(entity, contact, type){
        switch (type) {
            case shareDefine.PHY.TERRAIN_START:
                this.terrainResult = battle.physicsManager.terrainEntityStart(this, entity, contact);
                break;
            case shareDefine.PHY.TERRAIN_PRE:
                this.terrainResult = battle.physicsManager.terrainEntityPre(this, entity, contact);
                break;
            case shareDefine.PHY.TERRAIN_SEQ:
                this.terrainResult = battle.physicsManager.terrainEntitySeq(this, entity, contact);
                break;
        }
        return this.terrainResult;
    },

    step:function(){
        battle.posManager.charPosStep(this);
        battle.posManager.charLimitStep(this);
        battle.physicsManager.terrainCharStep(this);  
    },

    clear:function(){
        this._super();
        battle.physicsManager.destroyTerrain(this);
    }
})