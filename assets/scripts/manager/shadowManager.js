cc.Class({
    init:function() {
        // console.log("---init shadowManager---");
        this.shadowInterval = 5;
        this.nowShadow = [];
        this.shadowI = 0;
        this.shadowLen = 0;
        this.shadowY = 0;
    },

    initAllShadowInfo:function(){
        this.shadowInfo = {};
        this.l_s = -200;
        this.r_e = battle.battleManager.winSize.width + 200;
        let i, j, allFloors = battle.battleManager.allFloors;

        for(i = this.l_s; i <= this.r_e; i+=this.shadowInterval){
            this.shadowInfo[i] = [];
        }

        for(i = 0; i < allFloors.length; i++){
            let floor = allFloors[i];
            let floorL_S = floor.l_s;
            let floorR_E = floor.r_e;
            for(j = floorL_S; j <= floorR_E; j+=this.shadowInterval){
                if(this.shadowInfo[j]){
                    this.shadowInfo[j].push(floor.shadowInfo[j]);
                }
            }
        }

        for(i = this.l_s; i <= this.r_e; i+=this.shadowInterval){
            this.shadowInfo[i].sort(this.sortNumber);
        }
    },

    getShadowPos:function(pos){
        this.nowShadow = this.shadowInfo[Math.floor(pos.x / battle.shadowManager.shadowInterval) * battle.shadowManager.shadowInterval];
        this.shadowLen = this.nowShadow.length;
        if(this.shadowLen == 1){
            return this.nowShadow[0];
        }else if(this.shadowLen > 1){
            this.shadowY = this.nowShadow[0];
            for(this.shadowI = 1; this.shadowI < this.shadowLen; this.shadowI++){
                if(pos.y + 5 < this.nowShadow[this.shadowI]){
                    break;
                }else{
                    this.shadowY = this.nowShadow[this.shadowI];
                }
            }
            return this.shadowY;
        }else{
            return 0;
        }
    },

    sortNumber : function (a, b) {
        return a > b;
    },

    clear:function(){
        this.nowShadow = null;
    },
});
