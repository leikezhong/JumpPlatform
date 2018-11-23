var baseEntity = require("baseEntity");
cc.Class({
    extends: baseEntity,

    init: function (pos, wid, hei, rot) {
        this._super();
        this.initPos = pos;
        this.wid = wid;
        this.hei = hei;
        this.nowRot = rot||0;
        this.nowFriction = 1;
        this.shadowInfo = {};
        this.l_s = 0;
        this.r_e = 0;
        if(this.nowRot != 0){
            this.nowRot = Math.round(this.nowRot * 10000) / 10000;
        }

        this.entityType = shareDefine.ENTITY_TYPE.PLATFORM;

        this.initTerrain();
        this.initShadowInfo();
        this.active =true;
    },

    initTerrain : function () {
        this.terrainBody = battle.physicsManager.createRect(this.initPos.x, this.initPos.y, this.wid, this.hei, this.nowRot, box2d.b2BodyType.b2_staticBody);
        this.terrainBody.host = this;

        let filter = new box2d.b2Filter();
        filter.groupIndex = 1;
        filter.categoryBits = 0x0010;
        filter.maskBits = 0x000F;

        let fixture = this.terrainBody.GetFixtureList();
        fixture.SetFilterData(filter);
        fixture.SetFriction(1);
        fixture.SetRestitution(0);
    },

    initShadowInfo:function(){
        let fixture = this.terrainBody.GetFixtureList();
        let aabb = fixture.GetAABB(0);
        if(!aabb)   return;
        this.shadowInfo = {};
        let xNum = 0, xCount = 0;
        if(this.nowRot != 0){
            this.maxTopY = aabb.upperBound.y * battle.physicsManager.meterToPixel;
            let intervalHei = Math.sin(this.nowRot) * this.wid;
            let intervalWid = Math.cos(Math.PI / 2 - this.nowRot) * this.hei;
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

    clear:function(){
        this.shadowInfo = null;
        if(this.terrainBody){
            this.terrainBody.host = null;
            battle.physicsManager.destroyBody(this.terrainBody);
            this.terrainBody = null;
        }
    }
});
