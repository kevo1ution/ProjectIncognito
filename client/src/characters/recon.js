import Character from "./character";

class Recon extends Character {
  constructor(spriteName, moveDuration, scene, startPos, characterManager) {
    super(spriteName, moveDuration, scene, startPos, characterManager);
    this.events.addListener(
      "moveEnd",
      () => {
        this.scene.map.setupLightLayer();
      },
      this
    );
  }

  setupAnimations() {
    const spriteName = this.spriteName;
    const scene = this.scene;
    const moveDuration = this.moveDuration;
    scene.anims.create({
      key: spriteName + "left",
      frames: [
        { key: spriteName, frame: 9 },
        { key: spriteName, frame: 11 },
      ],
      frameRate: 4000 / moveDuration,
      repeat: 1,
    });

    scene.anims.create({
      key: spriteName + "right",
      frames: [
        { key: spriteName, frame: 8 },
        { key: spriteName, frame: 10 },
      ],
      frameRate: 4000 / moveDuration,
      repeat: 1,
    });

    scene.anims.create({
      key: spriteName + "up",
      frames: [
        { key: spriteName, frame: 4 },
        { key: spriteName, frame: 5 },
      ],
      frameRate: 4000 / moveDuration,
      repeat: 1,
    });

    scene.anims.create({
      key: spriteName + "down",
      frames: [
        { key: spriteName, frame: 1 },
        { key: spriteName, frame: 2 },
      ],
      frameRate: 4000 / moveDuration,
      repeat: 1,
    });

    scene.anims.create({
      key: spriteName + "idle",
      frames: [{ key: spriteName, frame: 0 }],
      frameRate: 4000,
      repeat: -1,
    });
  }

  onToggle(active) {
    if (active) {
      this.scene.map.showGuards();
    } else {
      this.scene.map.hideGuards();
    }
  }
}

export default Recon;
