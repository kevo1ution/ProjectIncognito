import Phaser from "phaser";

class Character {
  constructor(spriteName, moveDuration, scene, startPos, characterManager) {
    this.characterManager = characterManager;
    this.body = scene.add.sprite(startPos.x, startPos.y, spriteName);
    this.currentTween = scene.tweens.add({ duration: 0, targets: this.body });
    this.canPlayTween = true;
    this.moveDuration = moveDuration;
    this.scene = scene;

    this.particles = scene.add.particles("cloud");

    this.emitter = this.particles.createEmitter();
    this.emitter.pause();
    this.emitter.setSpeed(50);
    this.emitter.setBlendMode(Phaser.BlendModes.ADD);
    this.emitter.startFollow(this.body);

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
        { key: spriteName, frame: 11 },
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

        this.emitter.pause();
        this.sounds.run.stop();
        this.body.anims.play("idle", true);
      },
      scene
    );
  }

  async move(targetPos) {
    this.emitter.start()

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
    if (!this.canPlayTween || !this.canMove(map, targetPos)) {
      return;
    }

    this.move(targetPos);
    this.body.anims.play("up", true);
  }
  async moveDown(map) {
    const targetPos = { x: this.body.x, y: this.body.y + 32 };

    if (!this.canPlayTween || !this.canMove(map, targetPos)) {
      return;
    }

    this.move(targetPos);
    this.body.anims.play("down", true);
  }
  async moveLeft(map) {
    const targetPos = { x: this.body.x - 32, y: this.body.y };

    if (!this.canPlayTween || !this.canMove(map, targetPos)) {
      return;
    }

    this.move(targetPos);
    this.body.anims.play("left", true);
  }
  async moveRight(map) {
    const targetPos = { x: this.body.x + 32, y: this.body.y };
    if (!this.canPlayTween || !this.canMove(map, targetPos)) {
      return;
    }

    this.move(targetPos);
    this.body.anims.play("right", true);
  }

  canMove(map, targetPos) {
    const tile = map.getBlockingTile(targetPos);
    const otherChar = this.characterManager.getCharacterWorldXY(targetPos);
    if (otherChar || tile) {
      return false;
    }

    return true;
  }
}

export default Character;
