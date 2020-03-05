import Phaser from "phaser";
import config from "../config/config";

class Character {
  constructor(spriteName, moveDuration, scene, startPos, characterManager) {
    this.characterManager = characterManager;
    this.body = scene.add.sprite(startPos.x, startPos.y, spriteName);
    this.currentTween = scene.tweens.add({ duration: 0, targets: this.body });
    this.moving = false;
    this.moveDuration = moveDuration;
    this.scene = scene;
    this.spriteName = spriteName;
    this.body.setDepth(config.GAME.sprite.depth);
    this.events = new Phaser.Events.EventEmitter();

    this.sounds = {
      run: scene.sound.add(spriteName + "run")
    };

    this.setupAnimations();
    this.setupEventHooks();

    this.body.anims.play("idle", true);
  }

  setupAnimations() {
    const spriteName = this.spriteName;
    const scene = this.scene;
    const moveDuration = this.moveDuration;
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
  }

  setupEventHooks() {
    this.events.addListener("move", this.moveEffects, this);
  }

  moveEffects(map, dir) {
    let angle = 0;
    switch (dir) {
      case config.GAME.characters.move.UP:
        angle = -90;
        break;
      case config.GAME.characters.move.LEFT:
        angle = -180;
        break;
      case config.GAME.characters.move.DOWN:
        angle = 90;
        break;
      case config.GAME.characters.move.RIGHT:
        break;
      default:
        throw new Error("Invalid Direction!");
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
  }

  moveOnce(map, dir) {
    const targetPos = { x: this.body.x, y: this.body.y };
    switch (dir) {
      case config.GAME.characters.move.UP:
        targetPos.y -= config.GAME.tileSize.y;
        break;
      case config.GAME.characters.move.LEFT:
        targetPos.x -= config.GAME.tileSize.x;
        break;
      case config.GAME.characters.move.DOWN:
        targetPos.y += config.GAME.tileSize.y;
        break;
      case config.GAME.characters.move.RIGHT:
        targetPos.x += config.GAME.tileSize.x;
        break;
      default:
        throw new Error("Invalid Direction!");
    }

    if (!this.canMove(map, targetPos, dir)) {
      return;
    }

    const thisChar = this;
    return new Promise((res, rej) => {
      thisChar.events.emit("move", map, dir);
      thisChar.currentTween = thisChar.scene.tweens.add({
        ...targetPos,
        targets: thisChar.body,
        duration: thisChar.moveDuration,
        onComplete: () => {
          res(true);
        }
      });
    });
  }

  async move(map, dir) {
    if (this.moving) {
      return;
    }
    this.moving = true;

    const moved = await this.moveOnce(map, dir);
    if (moved) {
      this.body.anims.play("idle", true);
    }
    this.moving = false;
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
