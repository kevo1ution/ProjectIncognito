import Phaser from "phaser";
import config from "../config/config";

class Character {
  constructor(spriteName, moveDuration, scene, startPos, characterManager) {
    this.characterManager = characterManager;
    this.body = scene.add.sprite(startPos.x, startPos.y, spriteName);
    this.currentTween = scene.tweens.add({ duration: 0, targets: this.body });
    this.canPlayTween = true;
    this.moveDuration = moveDuration;
    this.scene = scene;
    this.body.setDepth(config.GAME.sprite.depth);

    this.sounds = {
      run: scene.sound.add(spriteName + "run")
    };

    scene.anims.create({
      key: "left",
      frames: [
        { key: spriteName, frame: 6 },
        { key: spriteName, frame: 7 }
      ],
      frameRate: 4000 / moveDuration,
      repeat: 1
    });

    scene.anims.create({
      key: "right",
      frames: [
        { key: spriteName, frame: 8 },
        { key: spriteName, frame: 9 }
      ],
      frameRate: 4000 / moveDuration,
      repeat: 1
    });

    scene.anims.create({
      key: "up",
      frames: [
        { key: spriteName, frame: 4 },
        { key: spriteName, frame: 5 }
      ],
      frameRate: 4000 / moveDuration,
      repeat: 1
    });

    scene.anims.create({
      key: "down",
      frames: [
        { key: spriteName, frame: 10 },
        { key: spriteName, frame: 11 }
      ],
      frameRate: 4000 / moveDuration,
      repeat: 1
    });

    scene.anims.create({
      key: "idle",
      frames: [{ key: spriteName, frame: 0 }],
      frameRate: 4000,
      repeat: -1
    });

    this.body.anims.play("idle", true);
    this.body.on(
      "animationcomplete",
      (animation, frame) => {
        if (animation.key === "idle") {
          return;
        }

        this.sounds.run.stop();
        this.body.anims.play("idle", true);
      },
      scene
    );
  }

  async move(targetPos, dir, map) {
    const footsteps = this.scene.add.image(
      this.body.x,
      this.body.y,
      "footsteps"
    );
    switch (dir) {
      case "up":
        footsteps.setAngle(-90);
        break;
      case "left":
        footsteps.setAngle(-180);
        break;
      case "down":
        footsteps.setAngle(90);
        break;
    }

    footsteps.setScale(0.03, 0.03);
    footsteps.setDepth(0);
    this.scene.tweens.add({
      alpha: 0,
      targets: footsteps,
      duration: this.moveDuration * 4,
      onComplete: () => {
        footsteps.destroy();
      }
    });

    this.sounds.run.play();
    this.canPlayTween = false;
    this.currentTween = this.scene.tweens.add({
      ...targetPos,
      targets: this.body,
      duration: this.moveDuration,
      onComplete: () => {
        this.canPlayTween = true;
      }
    });
  }

  // Abstract virtual functions for moving up, down, left, right
  async moveUp(map) {
    const targetPos = { x: this.body.x, y: this.body.y - 32 };
    if (!this.canPlayTween || !this.canMove(map, targetPos, "up")) {
      return;
    }

    this.move(targetPos, "up", map);
    this.body.anims.play("up", true);
  }
  async moveDown(map) {
    const targetPos = { x: this.body.x, y: this.body.y + 32 };

    if (!this.canPlayTween || !this.canMove(map, targetPos, "down")) {
      return;
    }

    this.move(targetPos, "down", map);
    this.body.anims.play("down", true);
  }
  async moveLeft(map) {
    const targetPos = { x: this.body.x - 32, y: this.body.y };

    if (!this.canPlayTween || !this.canMove(map, targetPos, "left")) {
      return;
    }

    this.move(targetPos, "left", map);
    this.body.anims.play("left", true);
  }
  async moveRight(map) {
    const targetPos = { x: this.body.x + 32, y: this.body.y };
    if (!this.canPlayTween || !this.canMove(map, targetPos, "right")) {
      return;
    }

    this.move(targetPos, "right", map);
    this.body.anims.play("right", true);
  }

  canMove(map, targetPos, dir) {
    const tile = map.getBlockingTile(targetPos);
    const otherChar = this.characterManager.getCharacterWorldXY(targetPos);
    if (otherChar || tile) {
      return false;
    }

    return true;
  }
}

export default Character;
