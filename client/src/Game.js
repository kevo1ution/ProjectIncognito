import Phaser from "phaser";
import React from "react";
import config from "./config/config";
import Map from "./maps/map";
import CharacterManager from "./characters/characterManager";

const game = new Phaser.Game(config.getPhaserConfig(preload, create, update));

function preload() {
  this.load.image("tilesBackground", "assets/gridtiles.png");
  this.load.image("tiles", "assets/items.png");
  this.load.tilemapTiledJSON("map", "assets/tutorial.json");
  this.load.spritesheet("dude", "assets/dude.png", {
    frameWidth: 32,
    frameHeight: 48
  });
}

function create() {
  const map = new Map("map", this);
  const characterManager = new CharacterManager(this);
  const cursors = this.input.keyboard.createCursorKeys();

  cursors.space.on("down", () => characterManager.toggleCharacter(), this);
  cursors.up.on("down", () => characterManager.getCurrentCharacter().moveUp(map), this);
  cursors.down.on("down", () => characterManager.getCurrentCharacter().moveDown(map), this);
  cursors.left.on("down", () => characterManager.getCurrentCharacter().moveLeft(map), this);
  cursors.right.on("down", () => characterManager.getCurrentCharacter().moveRight(map), this);
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
 *  //load all of the images and map
 * }
 *
 * create(){
 *  loadUI() //load ui of the game
 *
 *  //setup controls
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
