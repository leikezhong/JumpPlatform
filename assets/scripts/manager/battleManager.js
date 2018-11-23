var starEntity = require("starEntity");
var floorEntity = require("floorEntity");
cc.Class({
    init:function () {
        // console.log("---init battleManager---");
        this.nowAllScore = 0;//score
        this.nowEnergy = 100;
    },

    initBattle:function(){
        this.initParams();
        this.initUI();
        this.initWX();
        this.initEntity();
    },

    initParams:function(){
        this.frameSize = cc.view.getFrameSize();
        this.winSize = cc.director.getWinSize();
        this.isGameOver = false;
        this.allFloors = [];
        this.jumpPressStart = false;
        this.jumpPressDirect = 1;
        this.jumpPressVelYMax = 700;
        
        // console.log("winSize: ", this.winSize);
        // console.log("frameSize: ", this.frameSize);
    },

    initUI:function(){
        this.energyBar = battle.layerManager.uiLayer.getChildByName("energyBar").getComponent(cc.ProgressBar);
        if(this.energyBar){
            this.energyBar.node.y = this.winSize.height * .5 - 110;
        }

        this.scoreNow = battle.layerManager.uiLayer.getChildByName("scoreNow").getComponent(cc.Label);
        if(this.scoreNow){
            this.scoreNow.node.y = this.winSize.height * .5 - 150;
            this.scoreNow.string = "Score:" + this.nowAllScore;
        }
    },

    initWX:function(){
        this.wxHead = battle.layerManager.uiLayer.getChildByName("wxHead").getComponent(cc.Sprite);
        if(this.wxHead){
            this.wxHead.node.y = this.winSize.height * .5 - 50;
            var self = this;
            if(battle.wxManager.userInfo && battle.wxManager.userInfo.avatarUrl != ""){
                cc.loader.load({url: battle.wxManager.userInfo.avatarUrl, type: 'jpg'},
                    function (err, texture) {
                        self.wxHead.spriteFrame = new cc.SpriteFrame(texture);
                        self.wxHead.node.width = 60;
                        self.wxHead.node.height = 60;
                    }
                );
            }
        }

        this.wxName = battle.layerManager.uiLayer.getChildByName("wxName").getComponent(cc.Label);
        if(this.wxName){
            this.wxName.node.y = this.winSize.height * .5 - 50;
            if(battle.wxManager.userInfo){
                this.wxName.string = battle.wxManager.userInfo.nickName;
            }
        }
    },

    initEntity:function(){
        this.mainEntity = new starEntity();
        this.mainEntity.init(cc.v2(0, -400), 60, 90);

        this.mainFloor = new floorEntity();
        this.mainFloor.init(cc.v2(0, -500), 800, 200);
        this.allFloors.push(this.mainFloor);
    },

    onJumpPress:function(event){
        if(this.mainEntity){
            this.jumpPressStart = true;
            this.jumpPressDirect = 1;
            this.mainEntity.jumpVelY = 0;
        }
    },

    onJumpRelease:function(event){
        if(this.mainEntity){
            this.jumpPressStart = false;
            this.mainEntity.startJump();
        }
    },

    getRandom:function(){
        return Math.random();
    },

    gameOver:function(){
        if(!this.isGameOver){
            this.isGameOver = true;
            battle.wxManager.nowScore = this.nowAllScore;
            battle.layerManager.uiLayer.getChildByName("gotoRankingBtn").active = true;
            battle.layerManager.uiLayer.getChildByName("scoreTitle").active = true;
            battle.layerManager.uiLayer.getChildByName("scoreLabel").active = true;
            battle.layerManager.uiLayer.getChildByName("scoreLabel").getComponent(cc.Label).string = this.nowAllScore;
            // cc.director.loadScene("rankingScene");
            let score = this.nowAllScore;
            if (CC_WECHATGAME) {
                console.log("提交得分: x1 : " + score);
                window.wx.postMessage({
                    messageType: 3,
                    MAIN_MENU_NUM: "x1",
                    score: score,
                });
            } else {
                console.log("提交得分: x2 : " + score);
            }
        }
    },

    step:function(){
        if(this.isGameOver) return;
        this.mainStep();
        this.createPlatformStep();
    },

    mainStep:function(){
        if(this.jumpPressStart){
            if(this.mainEntity.jumpVelY > this.jumpPressVelYMax
             || this.mainEntity.jumpVelY < 0){
                this.jumpPressDirect = -this.jumpPressDirect;
            }
            this.mainEntity.jumpVelY += this.jumpPressDirect * 10;
            console.log(this.mainEntity.jumpVelY);
            this.energyBar.progress = this.mainEntity.jumpVelY / this.jumpPressVelYMax;
        }
    },

    createPlatformStep:function(){
        this.createSunCount++;
        
    },

    clear:function(){
        this.nowAllScore = 0;
        this.nowEnergy = 100;
    }
})