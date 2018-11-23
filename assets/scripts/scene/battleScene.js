cc.Class({
    extends: cc.Component,

    properties: {
        mainLayer:cc.Node,
        uiLayer:cc.Node
    },

    start:function(){
        cc.director.preloadScene("rankingScene", function () {
            cc.log("rankingScene preloaded");
        });
        // cc.director.setDisplayStats(true);
    },

    onLoad:function(){
        this.allManager = [
            "battleManager",
            "collisionManager",
            "enterFrameManager",
            "entityManager",
            "layerManager",
            "physicsManager",
            "poolManager",
            "posManager",
            "resourceManager",
            "shadowManager"
        ];

        for(let i = 0; i < this.allManager.length; i++){
            let manager = require(this.allManager[i]);
            battle[this.allManager[i]] = new manager();
            battle[this.allManager[i]].init();
        }
        battle.resourceManager.loadBaseResource(this.loadComplete.bind(this));
    },

    loadComplete:function(){
        this.initParams();
        battle.layerManager.initAllLayer(this);
        battle.enterFrameManager.initEnterFrame();
        battle.collisionManager.initCollision();
        battle.physicsManager.initPhy();
        battle.battleManager.initBattle();
        battle.shadowManager.initAllShadowInfo();
    },

    initParams:function(){
        this.mainLayer.on(cc.Node.EventType.TOUCH_START, this.onJumpPressFunc, this);
        this.mainLayer.on(cc.Node.EventType.TOUCH_END, this.onJumpReleaseFunc, this);
    },

    onJumpPressFunc:function(event){
        battle.battleManager.onJumpPress();
    },

    onJumpReleaseFunc:function(event){
        battle.battleManager.onJumpRelease();
    },

    update:function(dt){
        battle.battleManager.step();
        battle.entityManager.step();
        battle.physicsManager.step();
    },

    gotoRanking:function(){
        cc.director.loadScene("rankingScene");
    },

    onDestroy:function(){
        console.log("battle scene clear!!!");
        battle.battleManager.clear();
        battle.poolManager.clear();
        battle.enterFrameManager.clear();
        battle.entityManager.clear();
        battle.layerManager.clear();
        battle.resourceManager.clear();

        for(let i = 0; i < this.allManager.length; i++){
            let manager = require(this.allManager[i]);
            battle[this.allManager[i]] = null;
        }
    }
});
