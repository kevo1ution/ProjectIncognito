import Phaser from "phaser";

// Constant global variables to configure out game. These values should never change
const GAME = {
  tileSize: { x: 32, y: 32 },
  sprite: {
    size: { x: 80 / 3, y: 32 },
    depth: 100 // render ordering for sprites
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

export default { getPhaserConfig, GAME };
