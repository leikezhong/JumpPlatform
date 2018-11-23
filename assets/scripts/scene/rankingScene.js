cc.Class({
    extends: cc.Component,
    
    properties: {
        groupFriendButton: cc.Node,
        friendButton: cc.Node,
        gameOverButton: cc.Node,
        submitScore:cc.Node,
        rankingScrollView: cc.Sprite,//显示排行榜
    },
    onLoad() {
    },
    start() {
        if (CC_WECHATGAME) {
            window.wx.showShareMenu({withShareTicket: true});//设置分享按钮，方便获取群id展示群排行榜
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 640;
            window.sharedCanvas.height = 800;
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: "x1"
            });
        }
        cc.director.preloadScene("battleScene", function () {
            cc.log("rankingScene preloaded");
        });
    },
    friendButtonFunc(event) {
        if (CC_WECHATGAME) {
            console.log("获取好友排行榜数据。x1");
            // 发消息给子域
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: "x1"
            });
        } else {
            console.log("获取好友排行榜数据。x2");
        }
    },

    groupFriendButtonFunc: function (event) {
        if (CC_WECHATGAME) {
            console.log("获取群排行榜数据。x1");
            window.wx.shareAppMessage({
                success: (res) => {
                    if (res.shareTickets != undefined && res.shareTickets.length > 0) {
                        window.wx.postMessage({
                            messageType: 5,
                            MAIN_MENU_NUM: "x1",
                            shareTicket: res.shareTickets[0]
                        });
                    }
                }
            });
        } else {
            console.log("获取群排行榜数据。x2");
        }
    },

    gameOverButtonFunc: function (event) {
        if (CC_WECHATGAME) {
            console.log("获取横向展示排行榜数据。x1");
            window.wx.postMessage({// 发消息给子域
                messageType: 4,
                MAIN_MENU_NUM: "x1"
            });
        } else {
            console.log("获取横向展示排行榜数据。x2");
        }
    },

    submitScoreButtonFunc(){
        let score = battle.wxManager.nowScore;
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
    },

    quitButtonFunc(){
        cc.director.loadScene("battleScene");
    },

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined) {
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.rankingScrollView.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },
    update() {
        this._updateSubDomainCanvas();
    },
});
