import Phaser from "phaser";
import React from "react";
import config from "./config/config";
import Map from "./maps/map";
import CharacterManager from "./characters/characterManager";

const game = new Phaser.Game(config.getPhaserConfig(preload, create, update));

function preload() {
  this.load.image("tilesBackground", "assets/gridtiles.png");
  this.load.tilemapTiledJSON("map", "assets/tutorial.json");
  this.load.spritesheet("demolisher", "assets/demolisher.png", {
    frameWidth: config.GAME.sprite.size.x,
    frameHeight: config.GAME.sprite.size.y
  });

  this.load.audio("demolisherrun", "assets/run.wav");
  this.load.image("footsteps", "assets/footsteps.png");
}

function create() {
  const map = new Map("map", this);
  const characterManager = new CharacterManager(this);

  this.input.keyboard.on("keydown-SPACE", function(event) {
    characterManager.toggleCharacter();
  });
  this.input.keyboard.on("keydown-W", function(event) {
    characterManager
      .getCurrentCharacter()
      .move(map, config.GAME.characters.move.UP);
  });
  this.input.keyboard.on("keydown-A", function(event) {
    characterManager
      .getCurrentCharacter()
      .move(map, config.GAME.characters.move.LEFT);
  });
  this.input.keyboard.on("keydown-S", function(event) {
    characterManager
      .getCurrentCharacter()
      .move(map, config.GAME.characters.move.DOWN);
  });
  this.input.keyboard.on("keydown-D", function(event) {
    characterManager
      .getCurrentCharacter()
      .move(map, config.GAME.characters.move.RIGHT);
  });
  this.input.keyboard.on("keydown-F", function(event) {
    characterManager.getCurrentCharacter().ability(map);
  });
}

function update() {}

function Game() {
  return <div id="game" className="App"></div>;
}

export default Game;
