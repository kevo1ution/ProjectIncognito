import Phaser from "phaser";
import React from "react";
import config from "./config/config";
import Character from "./characters/character.js";
import Map from "./maps/map"

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

  // set collision
  // blockedLayer.setCollisionByProperty({ collides: true });
  // console.log(blockedLayer.getTileAt(3, 7));
  // blockedLayer.setCollision([290, 276]);
  // console.log(blockedLayer.layer.data);

  const players = [
    new Character("dude", 300, this, { x: 32 + 16, y: 32 + 16 }),
    new Character("dude", 300, this, { x: 32 * 2 + 16, y: 32 + 16 }),
    new Character("dude", 300, this, { x: 32 + 16, y: 32 * 2 + 16 })
  ];
  let curPlayer = 0;
  let player = players[0];
  const cursors = this.input.keyboard.createCursorKeys();

  cursors.space.on(
    "down",
    function() {
      curPlayer++;
      curPlayer = curPlayer % 3;
      player = players[curPlayer];
    },
    this
  );
  cursors.up.on("down", () => player.moveUp(), this);
  cursors.down.on("down", () => player.moveDown(), this);
  cursors.left.on("down", () => player.moveLeft(), this);
  cursors.right.on("down", () => player.moveRight(), this);
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
