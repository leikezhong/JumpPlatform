cc.Class({
    init:function () {
        // console.log("---init eterFrameManager---");
        this.enterFrameCount = 0;
        this.secondCount = 0;
    },

    initEnterFrame:function(){
        return;
        //每秒60帧
        this.frameComponent = new cc.Component();
        this.frameComponent.schedule(this.step.bind(this), 0.0167);
        this.rate = 1;
        this.intervalTotal = 0;
        this.intervalCount = 0;
    },

    quicken:function(){
        if(this.rate < 1){
            this.rate += 0.1;
            this.intervalTotal = Math.ceil((1 - this.rate) * 10 + 1) ;
        }else{
            this.rate += 1;
        }
    },

    slowly:function(){
        if(this.rate <= 1){
            this.rate -= 0.1;
            if(this.rate <= 0){
                this.rate = 0.1;
            }
            this.intervalTotal = Math.ceil((1 - this.rate) * 10 + 1);
        }else{
            this.rate -= 1;
        }
    },

    step:function(dt){
        if(this.rate >= 1){
            for(let i = 0; i < this.rate; i++){
                this.reallyStep();
            }
        }else{
            this.intervalCount++;
            if(this.intervalCount % this.intervalTotal == 0){
                this.reallyStep();
            }
        }
    },

    reallyStep:function(){
        this.enterFrameCount++;
        if(this.enterFrameCount % 2 == 0){
            battle.battleManager.step();
            battle.entityManager.step();
            battle.physicsManager.step();
        }
    },

    clear:function(){
        this.frameComponent.unscheduleAllCallbacks();
        this.frameComponent = null;
    }
});
