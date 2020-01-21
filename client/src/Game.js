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
