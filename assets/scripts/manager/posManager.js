cc.Class({
    init:function(){
        // console.log("---init posManager---");
    },

    initCharParams:function(host){
        host.nowEntityPos = cc.v2(0, 0);//坐标
        host.nowCenterEntityPos = cc.v2(0, 0);//中心点坐标
        host.offsetCenterX = host.terrainWid * .5;//中心点x轴偏移
        host.offsetCenterY = host.terrainHei * .5;//中心点y轴偏移
    },

    charPosStep:function(host){
        host.bodyPos = host.terrainBody.GetPosition();
        host.nowEntityPos.x = host.bodyPos.x * battle.physicsManager.meterToPixel;
        host.nowEntityPos.y = host.bodyPos.y * battle.physicsManager.meterToPixel - host.offsetCenterY;
        host.nowCenterEntityPos.x = host.bodyPos.x * battle.physicsManager.meterToPixel;
        host.nowCenterEntityPos.y = host.bodyPos.y * battle.physicsManager.meterToPixel;
    },

    charLimitStep:function(host){
        if(host.nowEntityPos.x > battle.battleManager.winSize.width * .5 - host.offsetCenterX){
            host.setCharXPos(battle.battleManager.winSize.width * .5 - host.offsetCenterX);
        }else if(host.nowEntityPos.x < -battle.battleManager.winSize.width * .5 + host.offsetCenterX){
            host.setCharXPos(-battle.battleManager.winSize.width * .5 + host.offsetCenterX);
        }
    },
});