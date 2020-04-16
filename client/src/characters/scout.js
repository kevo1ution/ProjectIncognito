import Character from "./character";
import config from "../config/config";

class Scout extends Character {
  setupAnimations() {
    const spriteName = this.spriteName;
    const scene = this.scene;
    const moveDuration = this.moveDuration;
    scene.anims.create({
      key: spriteName + "left",
      frames: [
        { key: spriteName, frame: 10 },
        { key: spriteName, frame: 11 },
      ],
      frameRate: 4000 / moveDuration,
      repeat: 1,
    });

    scene.anims.create({
      key: spriteName + "right",
      frames: [
        { key: spriteName, frame: 8 },
        { key: spriteName, frame: 9 },
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

  ability() {
    if (this.moving) {
      return;
    }

    const guardsPositions = [
      { x: this.body.x + config.GAME.tileSize.x, y: this.body.y },
      { x: this.body.x - config.GAME.tileSize.x, y: this.body.y },
      { x: this.body.x, y: this.body.y + config.GAME.tileSize.y },
      { x: this.body.x, y: this.body.y - config.GAME.tileSize.y },
    ];

    guardsPositions.forEach((pos) => {
      this.scene.map.rotateGuardOrTower(pos);
    });
  }

  async move(dir) {
    if (this.moving) {
      return;
    }
    this.moving = true;

    const moved = await this.moveOnce(dir);
    await this.moveOnce(dir);
    if (moved) {
      this.body.anims.play(this.spriteName + "idle", true);
      this.sounds.run.pause();
    }
    this.moving = false;
  }
}

export default Scout;
