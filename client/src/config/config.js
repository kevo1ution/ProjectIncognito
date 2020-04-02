import Phaser from "phaser";

// Constant global variables to configure out game. These values should never change
const GAME = {
  tileIndex: {
    guard: 34,
    tower: 48,
    light: 71,
    character: {
      demolisher: 127,
      scout: 113,
      recon: 99
    },
    cracked: {
      weak: 61,
      hole: 62
    }
  },
  tileSize: { x: 32, y: 32 },
  sprite: {
    size: { x: 80 / 3, y: 32 },
    depth: 100 // render ordering for sprites
  },
  characters: {
    move: {
      RIGHT: "right",
      DOWN: "down",
      LEFT: "left",
      UP: "up"
    },
    scout: {
      guardAndTowerRotation: Math.PI / 2
    }
  },
  obstacle: {
    guardSight: 2,
    towerSight: 5
  },
  levelCount: 3
};

const VIEW = {
  START_MENU: 0,
  LEVEL_MENU: 1,
  GAME: 2
};

function getPhaserConfig(preload, create, update) {
  return {
    type: Phaser.AUTO,
    width: 320,
    height: 640,
    scene: {
      preload,
      create,
      update
    },
    parent: "game"
  };
}

export default {
  getPhaserConfig,
  GAME: Object.freeze(GAME),
  VIEW: Object.freeze(VIEW)
};
