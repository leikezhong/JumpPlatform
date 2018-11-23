var shareDefine = {
    FRAME:{
        BASE_FRAME_INTERVAL:0.0167,
        SECOND_FRAME:60,

        
        FRAME_INTERVAL:0.0334,
        FRAME_RATE:2,
    },

    COLLISION : {
        CAMP_1:0,
        CAMP_2:1,
        CAMP_3:2,
        CAMP_4:3,
        CAMP_5:4,
        CAMP_1_SKILL: 5,
        CAMP_2_SKILL: 6,
        CAMP_3_SKILL: 7,
        CAMP_4_SKILL: 8,
        CAMP_5_SKILL: 9,
        HURT_1_SKILL: 10,
        HURT_2_SKILL: 11,
        HURT_3_SKILL: 12,
        HURT_4_SKILL: 13,
        HURT_5_SKILL: 14,

        HURT:1,
        BE_HURT:2
    },

    OPERATE : {
        NUM_NONE:-1,
        NUM_1:0,
        NUM_2:1,
        NUM_3:2,
        NUM_4:3,
        NUM_5:4,
        NUM_6:5,
        NUM_7:6,
        NUM_8:7,
        NUM_9:8,
        NUM_10:9,
    },

    PHY : {
        TERRAIN_PLAYER:0,
        TERRAIN_FLOOR:1,
        TERRAIN_PLATFORM:2,
        TERRAIN_GRASS:3,
        TERRAIN_PLAYER_COLLISION:4,
        TERRAIN_PLATFORM_LIMIT:5,
        TERRAIN_CONTACT_FLOOR:6,

        C_LAYER_1:2,
        C_LAYER_2:4,

        STATIC_RECT:0,
        STATIC_CIRCLE:1,
        DYNAMIC_RECT:2,
        DYNAMIC_CIRCLE:3,

        TERRAIN_START:1,
        TERRAIN_PRE:2,
        TERRAIN_SEQ:3
    },


    ACTION:{
        IDLE:1,
        SWIMMING:2,
        RUN:3,
        JUMP:4,
        DOUBLE_JUMP:5,
        JUMP_DOWN:6,
        RUN_ATTACK:101,
        JUMP_ATTACK:102,
        ATTACK_1:103,
        ATTACK_2:104,
        ATTACK_3:105,
        ATTACK_4:106,
        ATTACK_5:107,
        ATTACK_6:108,
        SKILL_1:201,
        SKILL_2:202,
        SKILL_3:203,
        SKILL_4:204,
        SKILL_5:205,
        SKILL_6:206,
        SKILL_7:207,
        SKILL_8:208,
        SKILL_9:209,
        SKILL_10:210,
        RIDE:301,
        BOUND:302,
        HURT:303,
        GROUND:304,
        DEAD:305,

        BUILD:401
    },

    ACTION_STATUS:{
        ACTION_1:"idle",
        ACTION_2:"swimming",
        ACTION_3:"run",
        ACTION_4:"jump",
        ACTION_5:"doublejump",
        ACTION_6:"jumpdown",
        ACTION_101:"runattack",
        ACTION_102:"jumpattack",
        ACTION_103:"attack1",
        ACTION_104:"attack2",
        ACTION_105:"attack3",
        ACTION_106:"attack4",
        ACTION_107:"attack5",
        ACTION_108:"attack6",
        ACTION_201:"skill1",
        ACTION_202:"skill2",
        ACTION_203:"skill3",
        ACTION_204:"skill4",
        ACTION_205:"skill5",
        ACTION_206:"skill6",
        ACTION_207:"skill7",
        ACTION_208:"skill8",
        ACTION_209:"skill9",
        ACTION_210:"skill10",
        ACTION_301:"ride",
        ACTION_302:"bound",
        ACTION_303:"hurt",
        ACTION_304:"dead",
        ACTION_305:"dead",
        
        ACTION_401:"build"
    },

    DIRECT:{
        LEFT:-1,
        RIGHT:1,
        NONE:0
    },

    CHAR_TYPE:{
        PLAYER:1,//英雄
        MON:2,//小怪
        TOWER:3,//塔
        CRYSTAL:4,//水晶
        BASE:5,//基地
        FIELD:6,//野怪
        BOSS:7//Boss
    },

    ENTITY_TYPE:{
        CHAR:1,
        FLOOR:2,
        PLATFORM:3,
        SKILL:4
    }
};




window.shareDefine = shareDefine;