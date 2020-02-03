import Phaser from "phaser";
import React from "react";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image('tiles', 'assets/gridtiles.png');
  this.load.tilemapTiledJSON('map', 'assets/simple-map.json');
}

function create() {
  const map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
  const tileset = map.addTilesetImage('tiles');
  const layer = map.createDynamicLayer('Level1', tileset);

}

function update() {}

function Game() {
  return <div id="game" className="App"></div>;
}

export default Game;

/**
 * Rough draft of code
 * currentCharacter = //enum.demolisioner, enum.recon, enum.scout, enum.null
 * characters = {demolisioner, recon, scout}
 * currentLevel = 0 - maxLevel
 * preload(){
 * 
 * }
 * 
 * create(){
 *  loadUI() //load ui of the game
 *  loadLevel() //loads tile for level
 * }
 * 
 * update(){
 *  
 *  //keyboard events
 *  if(currentCharacter !== enum.null){
 *    if(w is pressed){
 *      characters[currentCharacter].moveUp()
 *    }
 *    if(a,s,d is pressed)... etc.
 *    if(space pressed) toggleCharacter();
 *  }
 * }
 * 
 * 
 * characters <- demolisher, recon, scout
 * character{
 *  position {x, y}
 *  sprite
 * }
 */