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

  async move(map, dir) {
    let angle = 0;
    const targetPos = { x: this.body.x, y: this.body.y };
    switch (dir) {
      case config.GAME.characters.move.UP:
        angle = -90;
        targetPos.y -= config.GAME.tileSize.y;
        break;
      case config.GAME.characters.move.LEFT:
        angle = -180;
        targetPos.x -= config.GAME.tileSize.x;
        break;
      case config.GAME.characters.move.DOWN:
        angle = 90;
        targetPos.y += config.GAME.tileSize.y;
        break;
      case config.GAME.characters.move.RIGHT:
        targetPos.x += config.GAME.tileSize.x;
        break;
      default:
        throw new Error("Invalid Direction!");
    }

    if (!this.canPlayTween || !this.canMove(map, targetPos, dir)) {
      return;
    }

    const footsteps = this.scene.add.image(
      this.body.x,
      this.body.y,
      "footsteps"
    );
    footsteps.setAngle(angle);
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
    this.body.anims.play(dir, true);
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

  canMove(map, targetPos, dir) {
    const tile = map.getBlockingTile(targetPos);
    const otherChar = this.characterManager.getCharacterWorldXY(targetPos);
    if (otherChar || tile) {
      return false;
    }

    return true;
  }

  ability(map) {}
}

export default Character;
