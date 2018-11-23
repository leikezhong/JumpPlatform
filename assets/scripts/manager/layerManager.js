cc.Class({
    init:function () {
        // console.log("---init layerManager---");
        
    },

    initAllLayer:function(node){
        this.mainLayer = node.mainLayer;
        this.uiLayer = node.uiLayer;

        this.bgLayer = new cc.Node();
        this.enemyLayer = new cc.Node();
        this.playerLayer = new cc.Node();
        this.debugLayer = new cc.Node();
        this.debugLayer.addComponent(cc.Graphics);

        this.mainLayer.addChild(this.bgLayer);
        this.mainLayer.addChild(this.enemyLayer);
        this.mainLayer.addChild(this.playerLayer);
        this.mainLayer.addChild(this.debugLayer);

    },

    clear:function(){
        this.bgLayer.removeFromParent();
        this.enemyLayer.removeFromParent();
        this.playerLayer.removeFromParent();
        this.debugLayer.removeFromParent();

        this.bgLayer = null;
        this.enemyLayer = null;
        this.playerLayer = null;
        this.mainLayer = null;
    }
});
