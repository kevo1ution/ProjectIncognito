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
      recon: 99,
    },
    cracked: {
      weak: 61,
      hole: 62,
    },
  },
  tileSize: { x: 32, y: 32 },
  sprite: {
    size: { x: 32, y: 32 },
    depth: 100, // render ordering for sprites
  },
  characters: {
    move: {
      RIGHT: "right",
      DOWN: "down",
      LEFT: "left",
      UP: "up",
    },
    scout: {
      guardAndTowerRotation: Math.PI / 2,
    },
    recon: {
      viewRadius: 4, // can see guard 4 tiles away
      viewRadiusExpansionTime: 1500, // 4 seconds for radius ring to expand to full size
      guardFadeTime: 2000, // 4 seconds and guard dissappears
    },
  },
  obstacle: {
    guardSight: 2,
    towerSight: 5,
  },
  levelCount: 3,
};

const VIEW = {
  START_MENU: 0,
  LEVEL_MENU: 1,
  GAME: 2,
  LOST: 3,
  WIN: 4,
};

const SONGS = {
  RAW: [
    "assets/soundtrack/mainmenu.mp3",
    "assets/soundtrack/gameplay.mp3",
    "assets/soundtrack/winsong.mp3",
  ],
  mainmenu: 0,
  ingame: 1,
  win: 2,
};

function getPhaserConfig(preload, create, update) {
  return {
    type: Phaser.AUTO,
    width: 0,
    height: 0,
    scene: {
      preload,
      create,
      update,
    },
    parent: "game",
  };
}

export default {
  getPhaserConfig,
  GAME: Object.freeze(GAME),
  VIEW: Object.freeze(VIEW),
  SONGS: Object.freeze(SONGS),
};
