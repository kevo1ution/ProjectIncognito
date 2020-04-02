import Phaser from "phaser";
import React, { useEffect } from "react";
import config from "./config/config";
import Map from "./maps/map";
import CharacterManager from "./characters/characterManager";

let game;

function setupGame(selectedLevel) {
  game = new Phaser.Game(config.getPhaserConfig(preload, create, update));

  function setupKeyboardEvents(scene) {
    scene.input.keyboard.on(
      "keydown-R",
      function(event) {
        this.map.loadLevel("map");
      },
      scene
    );

    scene.input.keyboard.on(
      "keydown-SPACE",
      function(event) {
        scene.characterManager.toggleCharacter();
      },
      scene
    );
    scene.input.keyboard.on(
      "keydown-W",
      function(event) {
        const char = scene.characterManager.getCurrentCharacter();
        if (char) {
          char.move(config.GAME.characters.move.UP);
        }
      },
      scene
    );
    scene.input.keyboard.on(
      "keydown-A",
      function(event) {
        const char = scene.characterManager.getCurrentCharacter();
        if (char) {
          char.move(config.GAME.characters.move.LEFT);
        }
      },
      scene
    );
    scene.input.keyboard.on(
      "keydown-S",
      function(event) {
        const char = scene.characterManager.getCurrentCharacter();
        if (char) {
          char.move(config.GAME.characters.move.DOWN);
        }
      },
      scene
    );
    scene.input.keyboard.on(
      "keydown-D",
      function(event) {
        const char = scene.characterManager.getCurrentCharacter();
        if (char) {
          char.move(config.GAME.characters.move.RIGHT);
        }
      },
      scene
    );
    scene.input.keyboard.on(
      "keydown-F",
      function(event) {
        const char = scene.characterManager.getCurrentCharacter();
        if (char) {
          char.ability();
        }
      },
      scene
    );
  }

  function setupGameEvents(scene) {
    scene.events.addListener("lose", () => {
      alert("You lost! Press R to restart");
    });

    scene.events.addListener("win", () => {
      alert("You won!");
    });
  }

  function preload() {
    this.load.image("tilesBackground", "assets/gridtiles.png");
    this.load.tilemapTiledJSON("map", `assets/levels/level${selectedLevel}.json`);
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
    const scene = this;
    scene.map = new Map(scene);
    scene.characterManager = new CharacterManager(scene);
    scene.map.loadLevel("map");

    setupKeyboardEvents(scene);
    setupGameEvents(scene);
  }

  function update() {}
}

function destroyGame() {
  if (game) {
    game.destroy(true);
  }
}

function Game({ setCurrentView, selectedLevel }) {
  useEffect(() => {
    return function cleanup() {
      destroyGame();
    };
  });

  setupGame(selectedLevel);
  return <div></div>;
}

export default Game;
