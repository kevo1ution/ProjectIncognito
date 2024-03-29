import Phaser from "phaser";
import React, { useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import config from "../config/config";
import Map from "../maps/map";
import CharacterManager from "../characters/characterManager";

let game;

function restartGame(selectedLevel, setSelectedLevel, setCurrentView) {
  game.destroy(true);
  setupGame(selectedLevel, setSelectedLevel, setCurrentView);
}

function setupGame(selectedLevel, setSelectedLevel, setCurrentView) {
  game = new Phaser.Game(config.getPhaserConfig(preload, create, update));

  function setupGameEvents(scene) {
    scene.events.addListener("win", () => {
      const nextLevel = selectedLevel + 1;
      if (nextLevel <= config.GAME.levelCount) {
        setCurrentView(config.VIEW.WIN);
      } else {
        setCurrentView(config.VIEW.LEVEL_MENU);
      }
    });

    const caughtSound = scene.sound.add("gotcaught");
    scene.events.addListener("lose", (reason) => {
      scene.input.keyboard.removeAllListeners();

      const curCharBody = scene.characterManager.getCurrentCharacter().body;
      const curCharPos = { x: curCharBody.x, y: curCharBody.y };
      if (reason === config.GAME.characters.death.GUARD) {
        scene.map.lightupGuards(curCharPos, config.GAME.tileSize.x * 3, 0);
      }

      if (reason === config.GAME.characters.death.FALL) {
        // if demolisher then break it
        scene.map.breakWeakTerrain(curCharPos);
        scene.tweens.add({
          scale: 0,
          targets: curCharBody,
          duration: 1000,
        });
      }

      caughtSound.play();

      setTimeout(() => {
        setCurrentView(config.VIEW.LOST, reason);
      }, 1000);
    });
  }

  function setupKeyboardEvents(scene) {
    scene.input.keyboard.on(
      "keydown-SPACE",
      function (event) {
        scene.characterManager.toggleCharacter();
      },
      scene
    );
    scene.input.keyboard.on(
      "keydown-W",
      function (event) {
        const char = scene.characterManager.getCurrentCharacter();
        if (char) {
          char.move(config.GAME.characters.move.UP);
        }
      },
      scene
    );
    scene.input.keyboard.on(
      "keydown-A",
      function (event) {
        const char = scene.characterManager.getCurrentCharacter();
        if (char) {
          char.move(config.GAME.characters.move.LEFT);
        }
      },
      scene
    );
    scene.input.keyboard.on(
      "keydown-S",
      function (event) {
        const char = scene.characterManager.getCurrentCharacter();
        if (char) {
          char.move(config.GAME.characters.move.DOWN);
        }
      },
      scene
    );
    scene.input.keyboard.on(
      "keydown-D",
      function (event) {
        const char = scene.characterManager.getCurrentCharacter();
        if (char) {
          char.move(config.GAME.characters.move.RIGHT);
        }
      },
      scene
    );
    scene.input.keyboard.on(
      "keydown-F",
      function (event) {
        const char = scene.characterManager.getCurrentCharacter();
        if (char) {
          char.ability();
        }
      },
      scene
    );
  }

  function preload() {
    this.load.image("tilesBackground", process.env.PUBLIC_URL + "/assets/gridtiles.png");
    this.load.tilemapTiledJSON(
      "map",
      process.env.PUBLIC_URL + `/assets/levels/level${selectedLevel}.json`
    );
    this.load.spritesheet("demolisher", process.env.PUBLIC_URL + "/assets/demolisher.png", {
      frameWidth: config.GAME.sprite.size.x,
      frameHeight: config.GAME.sprite.size.y,
    });
    this.load.spritesheet("recon", process.env.PUBLIC_URL + "/assets/recon.png", {
      frameWidth: config.GAME.sprite.size.x,
      frameHeight: config.GAME.sprite.size.y,
    });
    this.load.spritesheet("scout", process.env.PUBLIC_URL + "/assets/scout.png", {
      frameWidth: config.GAME.sprite.size.x,
      frameHeight: config.GAME.sprite.size.y,
    });
    this.load.spritesheet("guard", process.env.PUBLIC_URL + "/assets/enemy.png", {
      frameWidth: config.GAME.sprite.size.x,
      frameHeight: config.GAME.sprite.size.y,
    });

    this.load.audio("demolisherrun", process.env.PUBLIC_URL + "/assets/soundFX/run.mp3");
    this.load.audio("reconrun", process.env.PUBLIC_URL +  "/assets/soundFX/run.mp3");
    this.load.audio("scoutrun",process.env.PUBLIC_URL +   "/assets/soundFX/run.mp3");
    this.load.audio("terrainBreaking", process.env.PUBLIC_URL + "/assets/soundFX/terrainbreaking.mp3");
    this.load.audio("rotateEnemy", process.env.PUBLIC_URL + "/assets/soundFX/rotate.mp3");
    this.load.audio("gotcaught", process.env.PUBLIC_URL + "/assets/soundFX/gotcaught.wav");
    this.load.image("footsteps",process.env.PUBLIC_URL +  "/assets/footsteps.png");
    this.load.image("downarrow", process.env.PUBLIC_URL + "/assets/arrow.png");
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

function Game({ setCurrentView, selectedLevel, setSelectedLevel }) {
  useEffect(() => {
    return function cleanup() {
      destroyGame();
    };
  });

  setupGame(selectedLevel, setSelectedLevel, setCurrentView);

  return (
    <div>
      <Container style={{ padding: "10px" }}>
        <Row>
          <Col>
            <Button
              onClick={() => {
                setCurrentView(config.VIEW.LEVEL_MENU);
              }}
              variant="outline-light"
            >
              {"<="}
            </Button>
          </Col>
          <Col>
            <Button
              onClick={() => {
                restartGame(selectedLevel, setSelectedLevel, setCurrentView);
              }}
              variant="outline-warning"
            >
              restart
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Game;
