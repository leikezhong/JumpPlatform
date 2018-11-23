var baseEntity = require("baseEntity");
cc.Class({
    extends: baseEntity,

    init: function (pos, wid, hei, rot) {
        this._super();
        this.initPos = pos;
        this.terrainWid = wid;
        this.terrainHei = hei;
        this.nowRot = rot||0;
        this.entityType = shareDefine.ENTITY_TYPE.PLATFORM;
        battle.physicsManager.initEntityParams(this);
        battle.posManager.initCharParams(this);
        this.initParams();
        this.initTerrain();
        this.initShadowInfo();
    },

    initParams:function(){
        this.nowFriction = 1;
        this.shadowInfo = {};
        this.l_s = 0;
        this.r_e = 0;
        if(this.nowRot != 0){
            this.nowRot = Math.round(this.nowRot * 10000) / 10000;
        }
        this.moveType = 0;
        this.moveDirect = battle.battleManager.getRandom()<0.5?-1:1;
        this.moveSpeed = 30 + 60 * battle.battleManager.getRandom();
        this.moveRange = 200 + 300 * battle.battleManager.getRandom();
    },

    initTerrain : function () {
        this.terrainBody = battle.physicsManager.createRect(this.initPos.x, this.initPos.y, this.terrainWid, this.terrainHei, this.nowRot, box2d.b2BodyType.b2_kinematicBody);
        this.terrainBody.host = this;

        let filter = new box2d.b2Filter();
        filter.groupIndex = 1;
        filter.categoryBits = 0x0010;
        filter.maskBits = 0x000F;

        let fixture = this.terrainBody.GetFixtureList();
        fixture.SetFilterData(filter);
        fixture.SetFriction(1);
        fixture.SetRestitution(0);

        switch(this.moveType){
            case 0:
                battle.physicsManager.setEntityBodyVel(this, this.moveSpeed * this.moveDirect, 0);
                break;
            case 1:
                battle.physicsManager.setEntityBodyVel(this, 0, this.moveSpeed * this.moveDirect);
                break;
        }
    },

    initShadowInfo:function(){
        let fixture = this.terrainBody.GetFixtureList();
        let aabb = fixture.GetAABB(0);
        if(!aabb)   return;
        this.shadowInfo = {};
        let xNum = 0, xCount = 0;
        if(this.nowRot != 0){
            this.maxTopY = aabb.upperBound.y * battle.physicsManager.meterToPixel;
            let intervalHei = Math.sin(this.nowRot) * this.terrainWid;
            let intervalWid = Math.cos(Math.PI / 2 - this.nowRot) * this.terrainHei;
            let verts = [];
            if(intervalWid < 0){
                this.l_s = Math.floor((aabb.lowerBound.x * battle.physicsManager.meterToPixel - intervalWid) / battle.shadowManager.shadowInterval) * battle.shadowManager.shadowInterval;
                this.r_e = Math.ceil(aabb.upperBound.x * battle.physicsManager.meterToPixel / battle.shadowManager.shadowInterval) * battle.shadowManager.shadowInterval;
                verts = [this.l_s, this.maxTopY, this.r_e, this.maxTopY + intervalHei];
            }else{
                this.l_s = Math.floor(aabb.lowerBound.x * battle.physicsManager.meterToPixel / battle.shadowManager.shadowInterval) * battle.shadowManager.shadowInterval;
                this.r_e = Math.ceil((aabb.upperBound.x * battle.physicsManager.meterToPixel - intervalWid)  / battle.shadowManager.shadowInterval) * battle.shadowManager.shadowInterval;
                verts = [this.l_s, this.maxTopY - intervalHei, this.r_e, this.maxTopY];
            }
            do{
                xNum = this.l_s + battle.shadowManager.shadowInterval * xCount;
                this.shadowInfo[xNum] = Math.floor((xNum - verts[0]) / (verts[2] - verts[0]) *  (verts[3] - verts[1]) + verts[1]) + 15;
                xCount++;
            }while (xNum < this.r_e);
        }else{
            this.l_s = Math.floor(aabb.lowerBound.x * battle.physicsManager.meterToPixel / battle.shadowManager.shadowInterval) * battle.shadowManager.shadowInterval;
            this.r_e = Math.ceil(aabb.upperBound.x * battle.physicsManager.meterToPixel / battle.shadowManager.shadowInterval) * battle.shadowManager.shadowInterval;
            this.maxTopY = aabb.upperBound.y * battle.physicsManager.meterToPixel;
            do{
                xNum = this.l_s + battle.shadowManager.shadowInterval * xCount;
                this.shadowInfo[xNum] = Math.floor(this.maxTopY);
                xCount++;
            }while (xNum < this.r_e);
        }
    },

    step:function(){
        this._super();
        battle.posManager.charPosStep(this);
        this.moveStep();
    },

    moveStep:function(){
        switch(this.moveType){
            case 0:
                if(this.nowCenterEntityPos.x > battle.battleManager.winSize.width * .5 - this.terrainWid * .5
                    || this.nowCenterEntityPos.x < -battle.battleManager.winSize.width * .5 + this.terrainWid * .5){
                    this.moveDirect = -this.moveDirect;
                    battle.physicsManager.setEntityBodyVel(this, this.moveSpeed * this.moveDirect, 0);
                }
                break;
            case 1:
                let fixture = this.terrainBody.GetFixtureList();
                let aabb = fixture.GetAABB(0);
                this.maxTopY = aabb.upperBound.y * battle.physicsManager.meterToPixel;

                if(Math.abs(this.nowCenterEntityPos.y - this.initPos.y) > this.moveRange){
                    this.moveDirect = -this.moveDirect;
                    battle.physicsManager.setEntityBodyVel(this, 0, this.moveSpeed * this.moveDirect);
                }
                break;
        }
        
    },

    clear:function(){
        this.shadowInfo = null;
        if(this.terrainBody){
            this.terrainBody.host = null;
            battle.physicsManager.destroyBody(this.terrainBody);
            this.terrainBody = null;
        }
        this._super();
    }
});
