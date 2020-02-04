import Phaser from "phaser";
import React from "react";

let player, cursors;
const config = {
  type: Phaser.AUTO,
  width: 320,
  height: 640,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};
const objectMap = [];

const game = new Phaser.Game(config);

function preload() {
  this.load.image("tilesBackground", "assets/gridtiles.png");
  this.load.image("tiles", "assets/items.png");
  this.load.tilemapTiledJSON("map", "assets/tutorial.json");
}

function create() {
  const map = this.make.tilemap({ key: "map", tileWidth: 32, tileHeight: 32 });
  const tileset = map.addTilesetImage("tiles");
  const tileset2 = map.addTilesetImage("tilesBackground");
  const backgroundLayer = map.createDynamicLayer("backgroundLayer", tileset2);
  const blockedLayer = map.createDynamicLayer("blockedLayer", tileset2);
  blockedLayer.putTileAt(290, 2, 2);

  // set collision
  // blockedLayer.setCollisionByProperty({ collides: true });
  // console.log(blockedLayer.getTileAt(3, 7));
  // blockedLayer.setCollision([290, 276]);
  // console.log(blockedLayer.layer.data);

  player = this.add.rectangle(32 + 16, 32 + 16, 26, 26, 0xffff00);
  cursors = this.input.keyboard.createCursorKeys();

  let currentTween;
  const tweenDuration = 100;
  const blockIndexCollidable = [290, 276];
  function hasObstacle(plrX, plrY) {
    const tile = blockedLayer.getTileAtWorldXY(plrX, plrY);
    return tile && blockIndexCollidable.includes(tile.index);
  }
  cursors.up.on(
    "down",
    function() {
      if (
        (currentTween && currentTween.isPlaying()) ||
        hasObstacle(player.x, player.y - 32)
      ) {
        return;
      }

      currentTween = this.tweens.add({
        targets: player,
        duration: tweenDuration,
        y: player.y - 32
      });
    },
    this
  );
  cursors.down.on(
    "down",
    function() {
      if (
        (currentTween && currentTween.isPlaying()) ||
        hasObstacle(player.x, player.y + 32)
      ) {
        return;
      }

      currentTween = this.tweens.add({
        targets: player,
        duration: tweenDuration,
        y: player.y + 32
      });
    },
    this
  );
  cursors.left.on(
    "down",
    function() {
      if (
        (currentTween && currentTween.isPlaying()) ||
        hasObstacle(player.x - 32, player.y)
      ) {
        return;
      }

      currentTween = this.tweens.add({
        targets: player,
        duration: tweenDuration,
        x: player.x - 32
      });
    },
    this
  );
  cursors.right.on(
    "down",
    function() {
      if (
        (currentTween && currentTween.isPlaying()) ||
        hasObstacle(player.x + 32, player.y)
      ) {
        return;
      }

      currentTween = this.tweens.add({
        targets: player,
        duration: tweenDuration,
        x: player.x + 32
      });
    },
    this
  );
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
