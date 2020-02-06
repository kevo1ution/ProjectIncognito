import Phaser from "phaser";

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

export default {
  getPhaserConfig
};
