//=============================================================================
// Ryo_BlastSkill
//=============================================================================

/*:
 * @plugindesc 随时使用逆转技.
 * @author RyoSonic
 *
 * @param Actor Skill
 * @desc 角色可以使用技能，用,分割
 * @default 13,14
 *
 * @param Actor Pos 1
 * @desc 角色1头像位置.
 * @default 100,100
 *
 * @param Actor Pos 2
 * @desc 角色2头像位置.
 * @default 100,100
 *
 * @param Actor Pos 3
 * @desc 角色3头像位置.
 * @default 100,100
 *
 * @param Actor Pos 4
 * @desc 角色4头像位置.
 * @default 100,100
 *
 * @param Actor Ani
 * @desc 特定角色发动逆转技能时播放的动画.
 * @default 13
 * @help  
 *
 * @param Icon X
 * @desc 技能图标X轴.
 * @default 100
 * @help  
 *
 * @param Icon Y
 * @desc 技能图标Y轴.
 * @default 400
 * @help  
 *
 * @param Name X
 * @desc 技能名字X轴.
 * @default 200
 * @help  
 *
 * @param Name Y
 * @desc 技能名字Y轴.
 * @default 400
 * @help  
 * 将所有文件放到／img／blast中
 * 在没有人行动时按下tab强制发动技能。
 */
var Imported = Imported || {};
Imported.Ryo_BlastSkill = true;
var Ryo = Ryo || {};
Ryo.parameters = PluginManager.parameters('Ryo_BlastSkill');

Ryo.blast_actorPos = []
for (i = 0; i < 4; i++){
    Ryo.blast_actorPos[i] = String(Ryo.parameters['Actor Pos ' + (i + 1)])
} 

Ryo.blast_actorAni = Number(Ryo.parameters['Actor Ani'])
Ryo.blast_skilliconX = Number(Ryo.parameters['Icon X'])
Ryo.blast_skilliconY = Number(Ryo.parameters['Icon Y'])
Ryo.blast_skillnameX = Number(Ryo.parameters['Name X'])
Ryo.blast_skillnameY = Number(Ryo.parameters['Name Y'])

Ryo.blastSkill = []
var b = String(Ryo.parameters['Actor Skill']).split(',')
for (i = 0; i < b.length; i++){
    Ryo.blastSkill.push(Number(b[i]))
} 

//=============================================================================
// Game Temp
//=============================================================================
var _ryo_blast_Game_Temp_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function() {
    _ryo_blast_Game_Temp_initialize.call(this);
    this._blastPhase = false;
};

//=============================================================================
// ImageManager
//=============================================================================
ImageManager.loadBlast = function(filename) {
    return this.loadBitmap('img/blast/', filename, 0, true);
};	

//=============================================================================
// BattleManager
//=============================================================================
var _ryo_blast_BattleManager_updateBattlerATB = BattleManager.updateBattlerATB;
BattleManager.updateBattlerATB = function(ignore) {
    _ryo_blast_BattleManager_updateBattlerATB.call(this,ignore);
   if (Input.isTriggered('tab')) {
       if ($gameSystem.isShowPartyLimitGauge() && $gameParty.partyLimitGauge() == $gameParty.partyLimitGaugeMax()) {
           for (i = 0; i < SceneManager._scene._blastWindow._actors.length; i++) {
               if (SceneManager._scene._blastWindow.isEnabled(i)) {
                   SceneManager._scene.commandBlast();
                   break;
               }
           }
       }
   }
}

//=============================================================================
// Window Blast
//=============================================================================
function Window_Blast() {
    this.initialize.apply(this, arguments);
}

Window_Blast.prototype = Object.create(Window_Selectable.prototype);
Window_Blast.prototype.constructor = Window_Blast;

Window_Blast.prototype.initialize = function(x, y) {
    this._actors = [];
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.refresh();
    this.createLayout();
    this.createFace();
    this.contentsOpacity = 0;
    this.opacity = 0;
    this.hide();
};

Window_Blast.prototype.createLayout = function() {
    this._layout = new Sprite(ImageManager.loadBlast('layout'))
    this.addChild(this._layout)
};

Window_Blast.prototype.createFace = function() {
    this._face = [];
    for (i = 0; i < this._actors.length; i++) {
        var a = Ryo.blast_actorPos[i].split(',')
        this._face[i] = new Sprite(ImageManager.loadBlast('Actor_' + this._actors[i]._actorId));
        this._face[i].x = a[0]
        this._face[i].y = a[1]
        this.addChild(this._face[i]);
    }
};

Window_Blast.prototype.createSkillName = function() {
    this.removeChild(this._skillName)
    this._skillName = new Sprite(new Bitmap(250,48));
    this._skillName.x = Ryo.blast_skillnameX;
    this._skillName.y = Ryo.blast_skillnameY;
    this._skillName.bitmap.fontSize = 28;
    this._skillName.bitmap.outlineWidth = 4;
    this.addChild(this._skillName)
    if (Ryo.blastSkill[this.actor()._actorId - 1] > 0) var skillname = $dataSkills[Ryo.blastSkill[this.actor()._actorId - 1]].name;
    else var skillname = ''
    this._skillName.bitmap.drawText(skillname, 0, 0, 250, 48,"left")
};

Window_Blast.prototype.createSkillIcon = function() {
    this.removeChild(this._skillIcon)
    this._skillIcon = new Sprite(ImageManager.loadSystem("IconSet"));
    this._skillIcon.x = Ryo.blast_skilliconX
    this._skillIcon.y = Ryo.blast_skilliconY
    this.addChild(this._skillIcon)
    if (Ryo.blastSkill[this.actor()._actorId - 1] > 0) var skillicon = $dataSkills[Ryo.blastSkill[this.actor()._actorId - 1]].iconIndex;
    else var skillicon = 0
    var sx = skillicon % 16 * 32;
    var sy = Math.floor(skillicon / 16) * 32;
    this._skillIcon.setFrame(sx, sy, 32, 32);
};

Window_Blast.prototype.windowWidth = function() {
    return 256;
};

Window_Blast.prototype.windowHeight = function() {
    return this.fittingHeight(this.numVisibleRows());
};

Window_Blast.prototype.numVisibleRows = function() {
    return 4;
};

Window_Blast.prototype.maxCols = function() {
    return 1;
};

Window_Blast.prototype.maxItems = function() {
    return this._actors.length;
};

Window_Blast.prototype.actor = function() {
    return this._actors[this.index()];
};

Window_Blast.prototype.actorIndex = function() {
    var actor = this.actor();
    return actor ? actor.index() : -1;
};

Window_Blast.prototype.drawItem = function(index) {
    this.resetTextColor();
    this.changePaintOpacity(this.isEnabled(index));
    var name = this._actors[index].name();
    var rect = this.itemRectForText(index);
    this.drawText(name, rect.x, rect.y, rect.width);
};

Window_Blast.prototype.show = function() {
    this.refresh();
    this.select(0);
    Window_Selectable.prototype.show.call(this);
};

Window_Blast.prototype.hide = function() {
    Window_Selectable.prototype.hide.call(this);
    $gameParty.select(null);
};

Window_Blast.prototype.refresh = function() {
    this._actors = $gameParty.battleMembers();
    Window_Selectable.prototype.refresh.call(this);
};

Window_Blast.prototype.select = function(index) {
    Window_Selectable.prototype.select.call(this, index);
    $gameParty.select(this.actor());
};

Window_Blast.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this.index())
};

Window_Blast.prototype.isEnabled = function(index) {
    if (Ryo.blastSkill[this._actors[index]._actorId - 1] > 0 && this._actors[index].isLearnedSkill(Ryo.blastSkill[this._actors[index]._actorId - 1]) && !this._actors[index].isDead()) return true;
    else return false;
};

Window_Blast.prototype.set_mcursor_data = function() {
};

//=============================================================================
// Scene Battle
//=============================================================================
var _ryo_blast_Scene_Battle_initialize = Scene_Battle.prototype.initialize;
Scene_Battle.prototype.initialize = function() {
    _ryo_blast_Scene_Battle_initialize.call(this);
    $gameTemp._blastPhase = false;
};

var _ryo_blast_Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows
Scene_Battle.prototype.createAllWindows = function() {
    _ryo_blast_Scene_Battle_createAllWindows.call(this);
    this.createBlastWindow();
}

Scene_Battle.prototype.createBlastWindow = function() {
    this._blastWindow = new Window_Blast();
    this._blastWindow.setHandler('ok',     this.onBlastOk.bind(this));
    this.addWindow(this._blastWindow);
};

Scene_Battle.prototype.commandBlast = function() {
    this._blastWindow.refresh();
    this._blastWindow.show();
    this._blastWindow.activate();
};

Scene_Battle.prototype.onBlastOk = function() {
    BattleManager._actorIndex = this._blastWindow.index();
    var battler = BattleManager.actor();
    battler.clearActions();
    battler._actionInputIndex = 0;
    var action = new Game_Action(battler, true)
    battler._actions.push(action);
    var skill = Ryo.blastSkill[battler._actorId - 1];
    action.setSkill(skill);
    BattleManager.actor().setLastBattleSkill(skill);
    if (Ryo.blast_actorAni > 0) battler.startAnimation(Ryo.blast_actorAni);
    $gameParty._partyLimit = 0;
    this.onSelectAction();
    $gameTemp._blastPhase = true;
};

var _ryo_blast_Scene_Battle_onSelectAction = Scene_Battle.prototype.onSelectAction;
Scene_Battle.prototype.onSelectAction = function() {
    this._blastWindow.hide();
    _ryo_blast_Scene_Battle_onSelectAction.call(this);
};

Scene_Battle.prototype.isAnyInputWindowActive = function() {
    return (this._partyCommandWindow.active || this._actorCommandWindow.active || this._skillWindow.active || this._itemWindow.active || this._actorWindow.active || this._enemyWindow.active || this._blastWindow.active);
};

var _ryo_blast_Scene_Battle_onActorOk = Scene_Battle.prototype.onActorOk
Scene_Battle.prototype.onActorOk = function() {
    _ryo_blast_Scene_Battle_onActorOk.call(this);
    $gameTemp._blastPhase = false;
};

var _ryo_blast_Scene_Battle_onEnemyOk = Scene_Battle.prototype.onEnemyOk
Scene_Battle.prototype.onEnemyOk = function() {
    _ryo_blast_Scene_Battle_onEnemyOk.call(this);
    $gameTemp._blastPhase = false;
};

var _ryo_blast_Scene_Battle_onActorCancel = Scene_Battle.prototype.onActorCancel
Scene_Battle.prototype.onActorCancel = function() {
    if ($gameTemp._blastPhase) {
        this._actorWindow.show();
        this._actorWindow.activate();
        return;
    }
    _ryo_blast_Scene_Battle_onActorCancel.call(this);
};

var _ryo_blast_Scene_Battle_onEnemyCancel = Scene_Battle.prototype.onEnemyCancel
Scene_Battle.prototype.onEnemyCancel = function() {
    if ($gameTemp._blastPhase) {
        this._enemyWindow.show();
        this._enemyWindow.activate();
        return;
    }
    _ryo_blast_Scene_Battle_onEnemyCancel.call(this);
};

var _ryo_blast_Scene_Battle_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function() {
    _ryo_blast_Scene_Battle_update.call(this);
    if (this._blastWindow.active) {
        for (i = 0; i < this._blastWindow._actors.length; i++) {
            if (this._blastWindow.isEnabled(i)) this._blastWindow._face[i].opacity = 255;
            else this._blastWindow._face[i].opacity = 160;
            if (this._blastWindow.index() === i) this._blastWindow._face[i].setBlendColor([255, 255, 255, 128])
            else this._blastWindow._face[i].setBlendColor([255, 255, 255, 0])
        }
        this._blastWindow.createSkillName();
        this._blastWindow.createSkillIcon();
    }
}

//=============================================================================
// Sprite Battler
//=============================================================================
var _ryo_blast_Sprite_Battler_updateSelectionEffect = Sprite_Battler.prototype.updateSelectionEffect
Sprite_Battler.prototype.updateSelectionEffect = function() {
    if (SceneManager._scene._blastWindow.active) return;
    _ryo_blast_Sprite_Battler_updateSelectionEffect.call(this);
};
