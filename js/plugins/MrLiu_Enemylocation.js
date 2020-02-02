//=============================================================================
// MrLiu_Enemylocation.js
//=============================================================================
 
/*:
 * @plugindesc 在RMMV游戏的横版战斗中让敌人自动排序
 * @author MrLiu-过眼云烟
 
 * @param Front Position X
 * @desc 第一个敌人的X坐标.
 * 默认值: 200
 * @default 200
 *
 * @param Front Position Y
 * @desc 第一个敌人的y坐标.
 * 默认值: 280
 * @default 280
 *
 * @param Front Instance X
 * @desc This formula determines the actor's home Y position.
 * 默认值: 32
 * @default 32
 *
 * @param Front Instance Y
 * @desc This formula determines the actor's home Y position.
 * 默认值: 48
 * @default 48
 * @help This plugin does not provide plugin commands. 
 */
//-----------------------------------------------------------------------------
// Window_MapName
//
// The window for displaying the map name on the map screen.
 
 
 
 
var Imported = Imported || {};
Imported.MrLiu_Enemylocation = true;
 
var Lmd = Lmd || {};
Lmd.Parameters = PluginManager.parameters('MrLiu_Enemylocation');
Lmd.Param = Lmd.Param || {};
        Lmd.Param.x1 = Number(Lmd.Parameters['Front Position X']);
    Lmd.Param.y1 = Number(Lmd.Parameters['Front Position Y']);
        Lmd.Param.x2 = Number(Lmd.Parameters['Front Instance X']);
        Lmd.Param.y2 = Number(Lmd.Parameters['Front Instance Y']);
 
(function() {
 
 
 


        Game_Enemy.prototype.screenX = function() {
                return Lmd.Param.x1 + this.index() * Lmd.Param.x2;//this._screenX;
        };
        
        Game_Enemy.prototype.screenY = function() {
                return Lmd.Param.y1 - (this.index()%4) * Lmd.Param.y2;//this._screenY;
        };

 
 
 
//var _Scene_Map_start = Scene_Map.prototype.start;
//Scene_Map.prototype.start = function() {
//   this._Scene_Map_start();
//   this._mapStatusWindow.open();
//};
})();
