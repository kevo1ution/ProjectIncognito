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
  this.load.spritesheet("recon", "assets/demolisher.png", {
    frameWidth: config.GAME.sprite.size.x,
    frameHeight: config.GAME.sprite.size.y
  });
  this.load.spritesheet("scout", "assets/demolisher.png", {
    frameWidth: config.GAME.sprite.size.x,
    frameHeight: config.GAME.sprite.size.y
  });

  this.load.audio("demolisherrun", "assets/run.wav");
  this.load.audio("reconrun", "assets/run.wav");
  this.load.audio("scoutrun", "assets/run.wav");
  this.load.image("footsteps", "assets/footsteps.png");
}

function create() {
  this.map = new Map("map", this);
  this.characterManager = new CharacterManager(this);

  this.input.keyboard.on(
    "keydown-SPACE",
    function(event) {
      this.characterManager.toggleCharacter();
    },
    this
  );
  this.input.keyboard.on(
    "keydown-W",
    function(event) {
      this.characterManager
        .getCurrentCharacter()
        .move(config.GAME.characters.move.UP);
    },
    this
  );
  this.input.keyboard.on(
    "keydown-A",
    function(event) {
      this.characterManager
        .getCurrentCharacter()
        .move(config.GAME.characters.move.LEFT);
    },
    this
  );
  this.input.keyboard.on(
    "keydown-S",
    function(event) {
      this.characterManager
        .getCurrentCharacter()
        .move(config.GAME.characters.move.DOWN);
    },
    this
  );
  this.input.keyboard.on(
    "keydown-D",
    function(event) {
      this.characterManager
        .getCurrentCharacter()
        .move(config.GAME.characters.move.RIGHT);
    },
    this
  );
  this.input.keyboard.on(
    "keydown-F",
    function(event) {
      this.characterManager.getCurrentCharacter().ability();
    },
    this
  );

  this.scale.resize(this.map.map.widthInPixels, this.map.map.heightInPixels);
}

function update() {}

function Game() {
  return <div id="game" className="App"></div>;
}

export default Game;
