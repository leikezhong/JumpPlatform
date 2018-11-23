window.battle = window.battle || {};
cc.Class({
    extends: cc.Component,

    properties: {
        btnNode:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        console.log("onLoad!");
        this.initManager();
        this.wxInfo();
        // cc.director.setClearColor(new cc.color(24,0,36));
    },

    initManager:function(){
        this.allManager = [
            "wxManager"
        ];

        for(let i = 0; i < this.allManager.length; i++){
            let manager = require(this.allManager[i]);
            battle[this.allManager[i]] = new manager();
            battle[this.allManager[i]].init();
        }
        
    },

    wxInfo:function(){
        var self = this;
        if(cc.sys.platform == cc.sys.WECHAT_GAME){
            wx.getSystemInfo({
                success: function(info) {
                    battle.wxManager.systemInfo = info;
                    self.wxLogin(self.btnNode);
                }
            });
        }
    },

    wxLogin:function (btnNode) {
        var self = this;
        if(CC_WECHATGAME){
            wx.login({
                success: function () {
                    console.log("login success!");
                    let btnSize = cc.size(btnNode.width+10,btnNode.height+10);
                    let frameSize = cc.view.getFrameSize();
                    let winSize = cc.director.getWinSize();
                    // console.log("winSize: ",winSize);
                    // console.log("frameSize: ",frameSize);
                    //适配不同机型来创建微信授权按钮
                    let left = (winSize.width*0.5+btnNode.x-btnSize.width*0.5)/winSize.width*frameSize.width;
                    let top = (winSize.height*0.5-btnNode.y-btnSize.height*0.5)/winSize.height*frameSize.height;
                    let width = btnSize.width/winSize.width*frameSize.width;
                    let height = btnSize.height/winSize.height*frameSize.height;
                    // console.log("button pos: ",cc.v2(left,top));
                    // console.log("button size: ",cc.size(width,height));
                    let button = wx.createUserInfoButton({
                        type: 'text',
                        text: '',
                        style: {
                            left: left,
                            top: top,
                            width: width,
                            height: height,
                            lineHeight: 0,
                            backgroundColor: '',
                            color: '#ffffff',
                            textAlign: 'center',
                            fontSize: 16,
                            borderRadius: 4
                        }
                    })
                    button.onTap((res) => {
                        console.log("onTap: ",res);
                        if (res.userInfo) {
                            button.hide();
                            battle.wxManager.userInfo = res.userInfo;
                            cc.director.loadScene("battleScene");
                            console.log("wxLogin auth success");
                            // wx.showToast({title:"授权成功"});
                        }else {
                            console.log("wxLogin auth fail");
                            wx.showToast({title:"授权失败"});
                        }
                    })
                }
            });
        }
    },

    startGame:function(){
        cc.director.loadScene("battleScene");
    },

    start () {
        cc.director.preloadScene("battleScene", function () {
            cc.log("rankingScene preloaded");
        });
    },

    // update (dt) {},
});
