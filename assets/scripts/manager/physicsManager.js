let DebugDraw = require('debugDraw');
cc.Class({
    init:function(){
        // console.log("---init physicsManager---");
        this.gravity = 10;
        this.gravityVec = new box2d.b2Vec2(0, -this.gravity);
        this.zeroVec = new box2d.b2Vec2(0, 0);
        this.antiGravityVec = new box2d.b2Vec2(0, this.gravity);
        this.meterToPixel = 30;
        this.pixelToMeter = 1/30;
    },

    initPhy:function () {
        this.world = new box2d.b2World(this.gravityVec, true);

        this.world.SetContactListener(this);
        this.setDebugDraw();
    },

    BeginContact:function(contact){
        // console.log("碰撞开始");
        let bodyA = contact.GetFixtureA().GetBody();
        let bodyB = contact.GetFixtureB().GetBody();
        if(bodyA.host && bodyB.host){
            if(bodyA.host.terrainCollision){
                bodyA.host.terrainCollision(bodyB.host, contact, shareDefine.PHY.TERRAIN_START);
            }
            if(bodyB.host.terrainCollision){
                bodyB.host.terrainCollision(bodyA.host, contact, shareDefine.PHY.TERRAIN_START);
            }
        }
    },
    EndContact:function(contact){
        // console.log("碰撞分离");
        let bodyA = contact.GetFixtureA().GetBody();
        let bodyB = contact.GetFixtureB().GetBody();
        if(bodyA.host && bodyB.host){
            if(bodyA.host.terrainCollision){
                bodyA.host.terrainCollision(bodyB.host, contact, shareDefine.PHY.TERRAIN_SEQ);
            }
            if(bodyB.host.terrainCollision){
                bodyB.host.terrainCollision(bodyA.host, contact, shareDefine.PHY.TERRAIN_SEQ);
            }
        }
    },
    PreSolve:function(contact){
        // console.log("碰撞过程中持续调用");
        let bodyA = contact.GetFixtureA().GetBody();
        let bodyB = contact.GetFixtureB().GetBody();
        if(bodyA.host && bodyB.host){
            if(bodyA.host.terrainCollision){
                bodyA.host.terrainCollision(bodyB.host, contact, shareDefine.PHY.TERRAIN_PRE);
            }
            if(bodyB.host.terrainCollision){
                bodyB.host.terrainCollision(bodyA.host, contact, shareDefine.PHY.TERRAIN_PRE);
            }
        }
    },
    PostSolve:function(contact){
        // console.log("碰撞修复中持续调用");
    },
    BeginContactFixtureParticle:function(system, contact){},
    EndContactFixtureParticle:function(system, contact){},
    BeginContactParticleParticle:function(system, contact){},
    EndContactParticleParticle:function(system, contact){},

    createCircle:function(xPos, yPos, radius, type){
        let bd = new box2d.b2BodyDef();
        bd.type = type;
        bd.position = new box2d.b2Vec2(xPos * this.pixelToMeter, yPos * this.pixelToMeter);

        let circle = new box2d.b2CircleShape(radius * this.pixelToMeter);
        let fd = new box2d.b2FixtureDef();
        fd.shape = circle;

        let body = this.world.CreateBody(bd);
        body.CreateFixture(fd);
        body.SetFixedRotation(true);

        return body;
    },

    createRect:function(xPos, yPos, wid, hei, rot, type){
        let bd = new box2d.b2BodyDef();
        bd.type = type;
        bd.position = new box2d.b2Vec2(xPos * this.pixelToMeter, yPos * this.pixelToMeter);

        let rect = new box2d.b2PolygonShape();
        rect.SetAsBox(wid * .5 * this.pixelToMeter, hei * .5 * this.pixelToMeter);
        let fd = new box2d.b2FixtureDef();
        fd.shape = rect;

        let body = this.world.CreateBody(bd);
        body.CreateFixture(fd);
        body.SetFixedRotation(true);
        if(rot != 0){
            body.SetAngle(rot);
        }

        return body;
    },

    destroyBody:function(body){
        this.world.DestroyBody(body);
    },

    setDebugDraw:function(){
        this.setDebug = true;
        let node = new cc.Node('PHYSICS_MANAGER_DEBUG_DRAW');
        node.zIndex = cc.macro.MAX_ZINDEX;
        battle.layerManager.debugLayer.addChild(node);
        this._debugDrawer = node.addComponent(cc.Graphics);
        let debugDraw = new DebugDraw(this._debugDrawer);
        debugDraw.SetFlags(1);
        this.world.SetDebugDraw(debugDraw);
    },

    step:function(){
        if(this.world){
            this.world.Step(1 / 30   //frame-rate
                ,  10       //velocity iterations
                ,  10       //position iterations
                );
            this.world.ClearForces();
            if(this.setDebug){
                this._debugDrawer.clear();
                this.world.DrawDebugData();
            }
        }
    },

    clear:function(){
        this.world = null;
    },

    initCharParams:function(host){
        host.terrainResult = false;
        host.terrainI = 0;
        host.terrainLen = 0;
        host.terrainEntity = null;
        host.terrainEntityIndex = 0;
        host.terrainEntityArr = [];//地形碰撞对象
        host.terrainCollisionArr = {};
        host.isFloat = true;//是否在空中
        host.floatStatus = false;
        host.jumpCount = 0;
        host.jumpVelY = 0;
        host.maxJumpCount = 1;//最大跳跃次数
        host.doubleJumpCount = 0;//
        host.terrainStartFrame = false;
        host.terrainStartY = 0;
        host.hasGravity = true;
        host.moveFloorRot = 0;//斜坡平台
        host.moveFloorSin = 0;
        host.nowBodyVel = cc.v2(0, 0);
    },

    initCharTerrain:function(host){
        host.terrainBody = this.createRect(host.initPos.x, host.initPos.y, host.terrainWid, host.terrainHei, 0, box2d.b2BodyType.b2_dynamicBody);
        host.terrainBody.host = host;

        let filter = new box2d.b2Filter();
        filter.groupIndex = 0;
        filter.categoryBits = 0x0001;
        filter.maskBits = 0x00F0;

        let fixture = host.terrainBody.GetFixtureList();
        fixture.SetFilterData(filter);
        fixture.SetFriction(1);
        fixture.SetRestitution(0);
    },

    //角色跳起
    startCharJump:function(host){
        if(this.judgeCanJump(host)){
            host.jumpCount++;
            host.isFloat = true;
            host.setBodyVel(0, host.jumpVelY);
        }
    },

    judgeCanJump:function(host){
        host.terrainResult = false;
        if(host.jumpCount < host.maxJumpCount){
            host.terrainResult = true;
        }
        if(host.onHurtStatus || host.onDeadStatus || host.onSkillStatus){
            host.terrainResult = false;
        }
        return host.terrainResult;
    },


    //角色下跳
    startCharJumpDown:function(host){
        if(host.terrainEntityArr.length > 0){
            if(this.judgeCanJumpDown(host)){
                for(host.terrainI = host.terrainEntityArr.length - 1; host.terrainI >= 0; host.terrainI--){
                    if(host.terrainEntityArr[host.terrainI].entityType == shareDefine.ENTITY_TYPE.PLATFORM){
                        host.terrainCollisionArr[host.terrainEntityArr[host.terrainI].entityId] = false;
                        host.terrainBody.SetAwake(true);
                    }
                }
            }
        }
    },

    judgeCanJumpDown:function(host){
        host.terrainResult = true;
        if(host.onHurtStatus || host.onDeadStatus || host.onSkillStatus){
            host.terrainResult = false;
        }
        return host.terrainResult;
    },

    setCharGravity:function(host, value){
        if(!value){
            host.terrainBody.ApplyForce(this.antiGravityVec, this.zeroVec);
            host.setBodyVel(0, 0);
        }
        host.hasGravity = value;
    },

    setCharBodyVel:function(host, velX, velY){
        if(!host.hasGravity)    return;
        if(host.terrainBody){
            host.nowBodyVel.x = velX * this.pixelToMeter;
            host.nowBodyVel.y = velY * this.pixelToMeter;
            host.terrainBody.SetLinearVelocity(host.nowBodyVel);
        }
    },

    setCharTerrainPos:function(host, xPos, yPos){
        host.terrainBody.SetAwake(true);
        host.terrainBody.SetPositionXY(xPos * this.pixelToMeter, yPos * this.pixelToMeter);
    },

    terrainCharStart:function(host, entity, contact){
        //平台判断
        if(entity.entityType == shareDefine.ENTITY_TYPE.PLATFORM){
            if(host.nowCharPos.y < entity.maxTopY - 5){
                contact.SetEnabled(false);
                return;
            }
        }else if(entity.entityType == shareDefine.ENTITY_TYPE.FLOOR){
            if(entity.nowRot != 0){
                host.moveFloorRot = entity.nowRot;
                host.moveFloorSin = Math.round(Math.sin(host.moveFloorRot) * 10000) / 10000;
                host.moveFloorCos = Math.round(Math.cos(host.moveFloorRot) * 10000) / 10000;
                host.moveFloorTopMaxY = entity.maxTopY - host.lastAttr.moveSpeed - 1;
            }
        }
        
        host.terrainStartFrame = true;
        host.terrainEntityIndex = host.terrainEntityArr.indexOf(entity);
        if (host.terrainEntityIndex == -1) {
            host.terrainEntityArr.push(entity);
            host.terrainCollisionArr[entity.entityId] = true;
        }
    },

    terrainCharPre:function(host, entity, contact){
        if(entity.entityType == shareDefine.ENTITY_TYPE.PLATFORM){
            if(host.nowCharPos.y < entity.maxTopY - 5){   
                contact.SetEnabled(false);
                return;
            }
        }
        if(host.terrainCollisionArr[entity.entityId] ==  false){
            contact.SetEnabled(false);
            this.terrainCharSeq(host, entity);
        }
    },

    terrainCharSeq:function(host, entity, contact){
        if(entity.entityType == shareDefine.ENTITY_TYPE.PLATFORM){
            if(contact){
                contact.SetEnabled(true);
            }
        }
        if(entity.entityType == shareDefine.ENTITY_TYPE.FLOOR){
            if(entity.nowRot != 0){
                host.moveFloorRot = 0;
            }
        }
        host.terrainEntityIndex = host.terrainEntityArr.indexOf(entity);
        if (host.terrainEntityIndex != -1) {
            host.terrainEntityArr.splice(host.terrainEntityIndex, 1);
            host.terrainCollisionArr[entity.entityId] = false;
        }
    },

    terrainCharStep:function(host){
        //跳跃判断
        host.terrainLen = host.terrainEntityArr.length;
        if(host.terrainLen > 0){
            if(host.isFloat == true){
                host.floatStatus = true;
                if(host.terrainLen > 0){
                    for(host.terrainI = 0; host.terrainI < host.terrainLen; host.terrainI++){
                        if(host.terrainEntityArr[host.terrainI].nowRot != 0){
                            host.floatStatus = false;
                            break;
                        }
                        if(host.nowCharPos.y > host.terrainEntityArr[host.terrainI].maxTopY - 5){
                            host.floatStatus = false;
                            break;
                        }
                    }
                }
                if(host.floatStatus){
                    host.isFloat = true;
                }else{
                    if(host.terrainBody.GetLinearVelocity().y <= 0){
                        host.isFloat = false;
                        host.jumpCount = 0;
                    }
                }
            }
        }else {
            host.isFloat = true;
        }
    },

    destroyTerrain:function(host){
        if(host.terrainBody){
            host.terrainBody.host = null;
            this.destroyBody(host.terrainBody);
            host.terrainBody = null;
        }
    }
});
