import Phaser from "phaser";

// Constant global variables to configure out game. These values should never change
const GAME = {
  tileIndex: {
    guard: 305,
    tower: 304,
    light: 327
  },
  tileSize: { x: 32, y: 32 },
  sprite: {
    size: { x: 80 / 3, y: 32 },
    depth: 100 // render ordering for sprites
  },
  characters: {
    move: {
      RIGHT: 1,
      DOWN: 2,
      LEFT: 3,
      UP: 4
    },
    scout: {
      guardAndTowerRotation: Math.PI / 2
    }
  },
  obstacle: {
    guardSight: 2,
    towerSight: 5
  }
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
    }
  };
}

export default { getPhaserConfig, GAME: Object.freeze(GAME) };
