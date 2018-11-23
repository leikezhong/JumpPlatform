cc.Class({
    init:function(){
        // console.log("---init posManager---");
    },

    initCharParams:function(host){
        host.nowCharPos = cc.v2(0, 0);//坐标
        host.nowCenterCharPos = cc.v2(0, 0);//中心点坐标
        host.offsetCenterX = host.terrainWid * .5;//中心点x轴偏移
        host.offsetCenterY = host.terrainHei * .5;//中心点y轴偏移
    },

    charPosStep:function(host){
        host.bodyPos = host.terrainBody.GetPosition();
        host.nowCharPos.x = host.bodyPos.x * battle.physicsManager.meterToPixel;
        host.nowCharPos.y = host.bodyPos.y * battle.physicsManager.meterToPixel - host.offsetCenterY;
        host.nowCenterCharPos.x = host.bodyPos.x * battle.physicsManager.meterToPixel;
        host.nowCenterCharPos.y = host.bodyPos.y * battle.physicsManager.meterToPixel;
    },

    charLimitStep:function(host){
        // if(host.nowCharPos.x > battle.mobaTiledManager.nowMapSize.width - host.offsetCenterX){
        //     host.setCharXPos(battle.mobaTiledManager.nowMapSize.width - host.offsetCenterX);
        // }else if(host.nowCharPos.x < host.offsetCenterX){
        //     host.setCharXPos(host.offsetCenterX);
        // }
    },
});