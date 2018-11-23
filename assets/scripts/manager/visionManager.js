cc.Class({
    init:function () {
        // console.log("---init visionManager---");
        this.visionEntity = null;
        this.cameraPos = cc.v2(0, 0);
    },

    initVision:function(camera){
        this.camera = camera;
        this.cameraNode = camera.getComponent(cc.Camera);
        this.cameraWid = (battle.battleManager.winSize.width/this.cameraNode.zoomRatio - battle.battleManager.winSize.width) * .5;
        this.cameraHei = (battle.battleManager.winSize.height/this.cameraNode.zoomRatio - battle.battleManager.winSize.height) * .5;
    },

    setVisionEntity:function(entity){
        this.visionEntity = entity;
    },

    step:function(){
        if(this.visionEntity){
            this.cameraPos = this.visionEntity.nowEntityPos;
        }
        if(this.cameraPos && battle.battleManager.winSize){
            //视野移动
            this.camera.x = 0;
            this.camera.y = -this.cameraPos.y + 40;
            if(this.camera.y > 0){
                this.camera.y = 0;
            }
            // if (this.camera.x > battle.mobaTiledManager.nowMapSize.width - this.winSize.width - this.cameraWid) {
            //     this.camera.x = battle.mobaTiledManager.nowMapSize.width - this.winSize.width - this.cameraWid;
            // }
            // if (this.camera.x < this.cameraWid) {
            //     this.camera.x = this.cameraWid;
            // }
            // if (this.camera.y < this.cameraHei) {
            //     this.camera.y = this.cameraHei;
            // }
            // if (this.camera.y > battle.mobaTiledManager.nowMapSize.height - this.winSize.height - this.cameraHei) {
            //     this.camera.y = battle.mobaTiledManager.nowMapSize.height - this.winSize.height - this.cameraHei;
            // }
        }
    },


    clear:function(){
        this.visionChar = null;
    }
});
